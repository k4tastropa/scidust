import { notFound } from "next/navigation"

import { ArtworkDialog } from "@/components/admin/artwork-dialog"
import { requireAdmin } from "@/lib/admin-auth"
import { sql } from "@/lib/database"

export const metadata = {
  title: "Edit archive | SCIDUST",
  robots: { index: false, follow: false },
}

type ArtworkRow = {
  archive_number: number
  title: string
  id: number
  published_at: Date | string | null
}

type ImageRow = {
  alt: string
  height: number
  id: number
  url: string
  width: number
}

function dateInputValue(value: Date | string | null) {
  if (!value) return new Date().toISOString().slice(0, 10)
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : value.slice(0, 10)
}

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const archiveNumber = Number(id)
  if (!Number.isSafeInteger(archiveNumber) || archiveNumber < 1) notFound()

  const [artwork] = (await sql`
    SELECT id, archive_number, title, published_at
    FROM artworks
    WHERE archive_number = ${archiveNumber}
  `) as ArtworkRow[]
  if (!artwork) notFound()

  const images = (await sql`
    SELECT artwork_images.id, artwork_images.url, artwork_images.alt,
      artwork_images.width, artwork_images.height
    FROM artwork_images
    INNER JOIN artworks ON artworks.id = artwork_images.artwork_id
    WHERE artworks.archive_number = ${archiveNumber}
    ORDER BY artwork_images.position ASC
  `) as ImageRow[]

  return (
    <main id="content" className="min-h-[calc(100svh-8rem)] bg-[#050505]">
      <ArtworkDialog
        artwork={{
          archiveNumber: artwork.archive_number,
          databaseId: artwork.id,
          title: artwork.title,
          publishedAt: dateInputValue(artwork.published_at),
          images,
        }}
      />
    </main>
  )
}
