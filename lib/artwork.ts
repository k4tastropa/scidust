import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"

type ArtworkMetadata = {
  id: number
  title: string
  description: string
  date: string
  images: Array<{
    file: string
    alt: string
    width: number
    height: number
  }>
}

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

const artworkDirectory = path.join(process.cwd(), "public", "artwork")

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

async function fileExists(filePath: string) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export const getArtworks = cache(async (): Promise<Artwork[]> => {
  const entries = await readdir(artworkDirectory, { withFileTypes: true })
  const folders = entries.filter(
    (entry) => entry.isDirectory() && /^\d+$/.test(entry.name)
  )

  const artworks = await Promise.all(
    folders.map(async (folder) => {
      const directory = path.join(artworkDirectory, folder.name)
      const metadata = JSON.parse(
        await readFile(path.join(directory, "artwork.json"), "utf8")
      ) as ArtworkMetadata
      const images = (
        await Promise.all(
          metadata.images.map(async (image) => {
            const exists = await fileExists(path.join(directory, image.file))

            return exists
              ? {
                  src: `/artwork/${folder.name}/${image.file}`,
                  alt: image.alt,
                  width: image.width,
                  height: image.height,
                }
              : null
          })
        )
      ).filter((image): image is NonNullable<typeof image> => image !== null)

      return {
        id: metadata.id,
        title:
          metadata.title.trim() ||
          `Signal ${String(metadata.id).padStart(2, "0")}`,
        description: descriptionExcerpt(metadata.description),
        year: metadata.date.slice(0, 4),
        images,
      }
    })
  )

  return artworks
    .filter((artwork) => artwork.images.length > 0)
    .sort((first, second) => second.id - first.id)
})
