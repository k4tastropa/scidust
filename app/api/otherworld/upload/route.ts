import { type HandleUploadBody, handleUpload } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin-auth"
import { sql } from "@/lib/database"

export const runtime = "nodejs"

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")

  if (!origin || !host) {
    return false
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody
  const response = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      if (!clientPayload) {
        throw new Error("Upload details are required.")
      }

      const payload = JSON.parse(clientPayload) as { artworkId?: unknown }
      const artworkId = Number(payload.artworkId)
      if (!Number.isSafeInteger(artworkId) || artworkId < 1) {
        throw new Error("Invalid artwork draft.")
      }

      const [artwork] = (await sql`
        SELECT id, archive_number FROM artworks
        WHERE id = ${artworkId} AND status = 'draft'
      `) as Array<{ id: number; archive_number: number }>
      const expectedPrefix = `artwork/upload/${artwork?.archive_number}/`

      if (!artwork || !pathname.startsWith(expectedPrefix)) {
        throw new Error("Invalid upload path.")
      }

      return {
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: 12 * 1024 * 1024,
        addRandomSuffix: true,
        validUntil: Date.now() + 10 * 60 * 1000,
        tokenPayload: clientPayload,
      }
    },
  })

  return NextResponse.json(response)
}
