import { neon } from "@neondatabase/serverless"
import { cache } from "react"

export type Artwork = {
  id: number
  title: string
  description: string
  year: string
  images: Array<{
    src: string
    alt: string
    width: number
    height: number
  }>
}

function descriptionExcerpt(description: string) {
  const lines = description
    .split("\n")
    .map((line) => line.split("#", 1)[0]?.trim() || "")
    .filter(
      (line) =>
        line.length > 12 &&
        !line.startsWith("#") &&
        !line.startsWith("©") &&
        line !== "."
    )

  return lines[0]?.replace(/\s+/g, " ") || "Untitled signal"
}

function yearFromDate(value: Date | string | null) {
  if (!value) {
    return "Undated"
  }

  return value instanceof Date
    ? String(value.getUTCFullYear())
    : value.slice(0, 4)
}

type ArtworkRow = {
  archive_number: number
  title: string
  description: string
  published_at: Date | string | null
}

type ArtworkImageRow = {
  artwork_number: number
  url: string
  alt: string
  width: number
  height: number
}

async function getBlobArtworks(): Promise<Artwork[]> {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return []
  }

  const sql = neon(databaseUrl)
  const [artworkRows, imageRows] = (await Promise.all([
    sql`
      SELECT archive_number, title, description, published_at
      FROM artworks
      WHERE status = 'published'
      ORDER BY sort_order DESC, archive_number DESC
    `,
    sql`
      SELECT
        artworks.archive_number AS artwork_number,
        artwork_images.url,
        artwork_images.alt,
        artwork_images.width,
        artwork_images.height
      FROM artwork_images
      INNER JOIN artworks ON artworks.id = artwork_images.artwork_id
      WHERE artworks.status = 'published'
      ORDER BY artworks.sort_order DESC, artworks.archive_number DESC, artwork_images.position ASC
    `,
  ])) as [ArtworkRow[], ArtworkImageRow[]]
  const imagesByArtwork = new Map<number, Artwork["images"]>()

  for (const image of imageRows) {
    const images = imagesByArtwork.get(image.artwork_number) ?? []
    images.push({
      src: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
    })
    imagesByArtwork.set(image.artwork_number, images)
  }

  return artworkRows
    .map((artwork) => ({
      id: artwork.archive_number,
      title:
        artwork.title.trim() ||
        `Archive ${String(artwork.archive_number).padStart(2, "0")}`,
      description: descriptionExcerpt(artwork.description),
      year: yearFromDate(artwork.published_at),
      images: imagesByArtwork.get(artwork.archive_number) ?? [],
    }))
    .filter((artwork) => artwork.images.length > 0)
}

export const getArtworks = cache(getBlobArtworks)
