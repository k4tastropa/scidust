import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getArtworks } from "@/lib/artwork"

type ArtworkPageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const artworks = await getArtworks()

  return artworks.map((artwork) => ({ id: String(artwork.id) }))
}

export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  const { id } = await params
  const artwork = (await getArtworks()).find(
    (candidate) => candidate.id === Number(id)
  )

  return {
    title: artwork ? `${artwork.title} | SCIDUST` : "Artwork | SCIDUST",
    description: artwork?.description,
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = await params
  const artwork = (await getArtworks()).find(
    (candidate) => candidate.id === Number(id)
  )

  if (!artwork) {
    notFound()
  }

  return (
    <main id="content" className="bg-[#051519] text-[#e2fffb]">
      <section className="relative isolate min-h-[70svh] overflow-hidden">
        <div className="absolute inset-y-0 right-0 left-0 md:left-[35%]">
          <Image
            src={artwork.images[0].src}
            alt={artwork.images[0].alt || artwork.description}
            fill
            priority
            sizes="(min-width: 768px) 65vw, 100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,15,18,0.18)_0%,#051519_100%)] md:bg-[linear-gradient(90deg,#051519_0%,rgba(5,21,25,0.96)_35%,rgba(5,21,25,0.22)_74%,rgba(5,21,25,0.1)_100%)]"
        />
        <div className="relative mx-auto flex min-h-[70svh] max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:px-12 md:py-10 xl:px-16">
          <Link
            href="/gallery"
            className="w-fit font-mono text-[10px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase transition-opacity outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#83e9e3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#051519] motion-reduce:transition-none"
          >
            Return to archive
          </Link>
          <div className="my-auto max-w-xl py-16">
            <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-[#83e9e3] uppercase">
              Record {String(artwork.id).padStart(2, "0")} / {artwork.year}
            </p>
            <h1 className="font-display mt-5 text-[clamp(3.6rem,8vw,8.5rem)] leading-[0.8] tracking-[-0.065em] uppercase">
              {artwork.title}
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[#c1eeeb] sm:text-lg">
              {artwork.description}
            </p>
          </div>
          <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase">
            Sequence 01 / {String(artwork.images.length).padStart(2, "0")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 md:px-12 md:py-32 xl:px-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-6 md:gap-y-24">
          {artwork.images.map((image, index) => (
            <figure
              key={image.src}
              className={
                index % 3 === 0
                  ? "md:col-span-7"
                  : index % 3 === 1
                    ? "md:col-span-4 md:col-start-9 md:mt-32"
                    : "md:col-span-5 md:col-start-3"
              }
            >
              <Image
                src={image.src}
                alt={image.alt || `${artwork.title}, image ${index + 1}`}
                width={image.width}
                height={image.height}
                sizes="(min-width: 768px) 55vw, 100vw"
                className="h-auto w-full bg-[#12363b]"
              />
              <figcaption className="mt-3 font-mono text-[10px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase">
                Frame {String(index + 1).padStart(2, "0")} /{" "}
                {String(artwork.images.length).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
