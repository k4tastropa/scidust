"use server"

import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  authenticateAdmin,
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  updateAdminPassword,
} from "@/lib/admin-auth"
import { sql } from "@/lib/database"

const MAX_DESCRIPTION_LENGTH = 5000
const MAX_TITLE_LENGTH = 160

function value(formData: FormData, key: string) {
  const field = formData.get(key)
  return typeof field === "string" ? field.trim() : ""
}

function positiveInteger(input: string) {
  const parsed = Number(input)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

function revalidateArtwork(archiveNumber: number) {
  revalidatePath("/")
  revalidatePath("/gallery")
  revalidatePath(`/gallery/${archiveNumber}`)
  revalidatePath("/contact")
  revalidatePath("/otherworld")
  revalidatePath(`/otherworld/${archiveNumber}`)
}

export async function loginAction(formData: FormData) {
  const username = value(formData, "username")
  const password = value(formData, "password")

  if (!username || !password || username.length > 160 || password.length > 256) {
    redirect("/otherworld/login?error=1")
  }

  const result = await authenticateAdmin(username, password)

  if (result.ok && result.credential) {
    await createAdminSession(result.credential)
    redirect("/otherworld")
  }

  redirect("/otherworld/login?error=1")
}

export async function logoutAction() {
  await destroyAdminSession()
  redirect("/otherworld/login")
}

export async function updateContactAction(formData: FormData) {
  await requireAdmin()
  const email = value(formData, "email")
  const instagramUrl = value(formData, "instagramUrl")

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    redirect("/otherworld?contactError=1")
  }

  try {
    const url = new URL(instagramUrl)
    const host = url.hostname.toLowerCase()
    if (
      url.protocol !== "https:" ||
      (host !== "instagram.com" && host !== "www.instagram.com")
    ) {
      throw new Error("Invalid Instagram URL")
    }
  } catch {
    redirect("/otherworld?contactError=1")
  }

  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES
      ('instagram_url', ${instagramUrl}, NOW()),
      ('contact_email', ${email}, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW()
  `
  revalidatePath("/contact")
  redirect("/otherworld?contactSaved=1")
}

export async function updateCaptionAction(formData: FormData) {
  await requireAdmin()
  const archiveNumber = positiveInteger(value(formData, "archiveNumber"))
  const title = value(formData, "title")
  const description = value(formData, "description")

  if (
    !archiveNumber ||
    title.length > MAX_TITLE_LENGTH ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    redirect("/otherworld")
  }

  await sql`
    UPDATE artworks
    SET title = ${title}, description = ${description}, updated_at = NOW()
    WHERE archive_number = ${archiveNumber}
  `
  revalidateArtwork(archiveNumber)
  redirect(`/otherworld/${archiveNumber}?saved=1`)
}

export async function moveArtworkAction(formData: FormData) {
  await requireAdmin()
  const archiveNumber = positiveInteger(value(formData, "archiveNumber"))
  const direction = value(formData, "direction")

  if (!archiveNumber || !["up", "down"].includes(direction)) {
    redirect("/otherworld")
  }

  const [current] = (await sql`
    SELECT archive_number, sort_order
    FROM artworks
    WHERE archive_number = ${archiveNumber}
  `) as Array<{ archive_number: number; sort_order: number }>

  if (!current) {
    redirect("/otherworld")
  }

  const comparison = direction === "up" ? ">" : "<"
  const ordering = direction === "up" ? "ASC" : "DESC"
  const targetRows = await sql.query(
    `SELECT archive_number, sort_order
     FROM artworks
     WHERE sort_order ${comparison} $1
     ORDER BY sort_order ${ordering}
     LIMIT 1`,
    [current.sort_order]
  )
  const target = targetRows[0] as
    | { archive_number: number; sort_order: number }
    | undefined

  if (target) {
    await sql`
      UPDATE artworks
      SET sort_order = CASE
        WHEN archive_number = ${current.archive_number} THEN ${target.sort_order}
        WHEN archive_number = ${target.archive_number} THEN ${current.sort_order}
        ELSE sort_order
      END,
      updated_at = NOW()
      WHERE archive_number IN (${current.archive_number}, ${target.archive_number})
    `
    revalidateArtwork(current.archive_number)
    revalidateArtwork(target.archive_number)
  }

  redirect("/otherworld")
}

export async function deleteArtworkAction(archiveNumberInput: number) {
  await requireAdmin()
  const archiveNumber = positiveInteger(String(archiveNumberInput))
  if (!archiveNumber) {
    return { ok: false }
  }

  const images = (await sql`
    SELECT artwork_images.url
    FROM artwork_images
    INNER JOIN artworks ON artworks.id = artwork_images.artwork_id
    WHERE artworks.archive_number = ${archiveNumber}
  `) as Array<{ url: string }>

  if (images.length) {
    await del(images.map((image) => image.url))
  }

  await sql`DELETE FROM artworks WHERE archive_number = ${archiveNumber}`
  revalidateArtwork(archiveNumber)
  return { ok: true }
}

export async function changePasswordAction(formData: FormData) {
  await requireAdmin()
  const currentPassword = value(formData, "currentPassword")
  const nextPassword = value(formData, "nextPassword")

  if (
    !currentPassword ||
    nextPassword.length < 12 ||
    nextPassword.length > 256
  ) {
    redirect("/otherworld?passwordError=1")
  }

  const updated = await updateAdminPassword(currentPassword, nextPassword)
  redirect(`/otherworld?${updated ? "passwordSaved=1" : "passwordError=1"}`)
}

export async function createArtworkDraftAction(input: {
  title: string
  description: string
  publishedAt: string
}) {
  await requireAdmin()
  const title = input.title.trim()
  const description = input.description.trim()

  if (
    title.length > MAX_TITLE_LENGTH ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new Error("Artwork details are too long.")
  }

  const [next] = (await sql`
    SELECT COALESCE(MAX(archive_number), 0) + 1 AS archive_number,
           COALESCE(MAX(sort_order), 0) + 1 AS sort_order
    FROM artworks
  `) as Array<{ archive_number: number; sort_order: number }>
  const archiveNumber = Number(next.archive_number)
  const sortOrder = Number(next.sort_order)
  const date = input.publishedAt ? new Date(input.publishedAt) : new Date()

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid artwork date.")
  }

  const [artwork] = (await sql`
    INSERT INTO artworks (
      archive_number, slug, title, description, published_at, status, sort_order
    )
    VALUES (
      ${archiveNumber}, ${`signal-${String(archiveNumber).padStart(3, "0")}`},
      ${title}, ${description}, ${date.toISOString()}, 'draft', ${sortOrder}
    )
    RETURNING id, archive_number
  `) as Array<{ id: number; archive_number: number }>

  return { id: Number(artwork.id), archiveNumber: Number(artwork.archive_number) }
}

export async function attachUploadedImageAction(input: {
  artworkId: number
  pathname: string
  url: string
  contentType: string
  position: number
  width: number
  height: number
  alt: string
}) {
  await requireAdmin()
  const artworkId = positiveInteger(String(input.artworkId))
  const position = positiveInteger(String(input.position + 1))
  const width = positiveInteger(String(input.width))
  const height = positiveInteger(String(input.height))

  if (!artworkId || !position || !width || !height || input.alt.length > 500) {
    throw new Error("Invalid image details.")
  }

  const imageUrl = new URL(input.url)
  if (
    imageUrl.protocol !== "https:" ||
    !imageUrl.hostname.endsWith(".public.blob.vercel-storage.com") ||
    !["image/jpeg", "image/png", "image/webp"].includes(input.contentType)
  ) {
    throw new Error("Invalid uploaded image.")
  }

  const [artwork] = (await sql`
    SELECT id FROM artworks WHERE id = ${artworkId} AND status = 'draft'
  `) as Array<{ id: number }>
  if (!artwork) {
    throw new Error("Artwork draft was not found.")
  }

  await sql`
    INSERT INTO artwork_images (
      artwork_id, source_path, blob_path, url, alt, width, height, position
    )
    VALUES (
      ${artworkId}, ${input.pathname}, ${input.pathname}, ${input.url},
      ${input.alt.trim()}, ${width}, ${height}, ${input.position}
    )
  `
}

export async function publishArtworkAction(artworkIdInput: number) {
  await requireAdmin()
  const artworkId = positiveInteger(String(artworkIdInput))
  if (!artworkId) {
    throw new Error("Artwork was not found.")
  }

  const [artwork] = (await sql`
    SELECT artworks.archive_number, COUNT(artwork_images.id)::integer AS image_count
    FROM artworks
    LEFT JOIN artwork_images ON artwork_images.artwork_id = artworks.id
    WHERE artworks.id = ${artworkId} AND artworks.status = 'draft'
    GROUP BY artworks.archive_number
  `) as Array<{ archive_number: number; image_count: number }>

  if (!artwork || Number(artwork.image_count) < 1) {
    throw new Error("An artwork needs at least one image.")
  }

  await sql`
    UPDATE artworks SET status = 'published', updated_at = NOW()
    WHERE id = ${artworkId}
  `
  revalidateArtwork(Number(artwork.archive_number))
}
