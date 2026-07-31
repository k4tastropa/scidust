import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { updateCaptionAction } from "@/app/otherworld/actions"
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button"
import { requireAdmin } from "@/lib/admin-auth"
import { sql } from "@/lib/database"

export const metadata = {
  title: "Edit archive | SCIDUST",
  robots: { index: false, follow: false },
}

type ArtworkRow = {
  archive_number: number
  title: string
  description: string
  published_at: Date | string | null
}

type ImageRow = {
  id: number
  url: string
  alt: string
  width: number
  height: number
  position: number
}

export default async function EditArtworkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const archiveNumber = Number(id)
  if (!Number.isSafeInteger(archiveNumber) || archiveNumber < 1) {
    notFound()
  }

  const [artwork] = (await sql`
    SELECT archive_number, title, description, published_at
    FROM artworks
    WHERE archive_number = ${archiveNumber}
  `) as ArtworkRow[]
  if (!artwork) {
    notFound()
  }
  const images = (await sql`
    SELECT artwork_images.id, artwork_images.url, artwork_images.alt,
      artwork_images.width, artwork_images.height, artwork_images.position
    FROM artwork_images
    INNER JOIN artworks ON artworks.id = artwork_images.artwork_id
    WHERE artworks.archive_number = ${archiveNumber}
    ORDER BY artwork_images.position ASC
  `) as ImageRow[]
  const { saved } = await searchParams

  return (
    <main id="content" className="min-h-[calc(100svh-8rem)] bg-[#050505] text-[#effffd]">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 md:px-12 md:py-11 xl:px-16">
        <Link href="/otherworld" className="inline-flex min-h-11 items-center border border-[#a7e5df]/40 px-3 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none">
          Return to archive
        </Link>

        <header className="mt-10 border-t border-[#a7e5df]/45 pt-5">
          <p className="font-mono text-[10px] tracking-[0.17em] text-[#f4988f] uppercase">Signal {String(artwork.archive_number).padStart(2, "0")}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6"><h1 className="font-display max-w-[10ch] text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.75] tracking-[-0.07em] uppercase">{artwork.title || "Untitled signal"}</h1><DeleteArtworkButton archiveNumber={artwork.archive_number} /></div>
        </header>

        <section className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.65fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <figure key={image.id} className="border border-[#a7e5df]/25 p-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1110]"><Image src={image.url} alt={image.alt || ""} fill sizes="(min-width: 1024px) 38vw, 88vw" className="object-contain" /></div>
                <figcaption className="mt-2 flex justify-between font-mono text-[9px] tracking-[0.12em] text-[#a7e5df]/70 uppercase"><span>Carousel {String(index + 1).padStart(2, "0")}</span><span>{image.width} × {image.height}</span></figcaption>
              </figure>
            ))}
          </div>

          <section className="border-t border-[#f4988f]/65 pt-4 lg:sticky lg:top-8 lg:self-start">
            <p className="font-mono text-[10px] tracking-[0.14em] text-[#f4988f] uppercase">Text field</p>
            <form action={updateCaptionAction} className="mt-5 grid gap-5">
              <input type="hidden" name="archiveNumber" value={artwork.archive_number} />
              <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">Title<input name="title" defaultValue={artwork.title} maxLength={160} className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" /></label>
              <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">Caption<textarea name="description" defaultValue={artwork.description} maxLength={5000} rows={14} className="resize-y border border-[#a7e5df]/35 bg-transparent p-3 font-sans text-sm leading-relaxed tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" /></label>
              <button className="min-h-12 justify-self-start bg-[#a7e5df] px-4 font-mono text-[10px] tracking-[0.15em] text-[#061413] uppercase transition-colors hover:bg-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] focus-visible:outline-none">Save caption</button>
              {saved ? <p aria-live="polite" className="font-mono text-[10px] text-[#a7e5df]">Caption saved to the public archive.</p> : null}
            </form>
          </section>
        </section>
      </div>
    </main>
  )
}
