import Image from "next/image"
import Link from "next/link"

import type { Artwork } from "@/lib/artwork"

const layouts = [
  "md:col-span-7 xl:col-span-6",
  "md:col-span-4 md:col-start-9 md:mt-32 xl:col-start-9",
  "md:col-span-5 md:col-start-2 md:mt-16 xl:col-start-2",
  "md:col-span-4 md:col-start-8 md:mt-36 xl:col-start-8",
  "md:col-span-6 md:col-start-5 md:mt-12 xl:col-span-5 xl:col-start-6",
  "md:col-span-4 md:col-start-1 md:mt-28 xl:col-start-1",
  "md:col-span-6 md:col-start-7 md:mt-10 xl:col-span-5 xl:col-start-8",
  "md:col-span-5 md:col-start-3 md:mt-24 xl:col-start-3",
]

function archiveNumber(id: number) {
  return String(id).padStart(2, "0")
}

export function LivingIndex({ artworks }: { artworks: Artwork[] }) {
  return (
    <section
      aria-labelledby="archive-heading"
      className="relative z-10 pb-28 md:pb-48"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12 xl:px-16">
        <div className="grid gap-8 border-t border-[#75d9d3]/35 pt-5 md:grid-cols-12 md:gap-6 md:pt-7">
          <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase sm:text-[10px] md:col-span-3">
            All signals / {archiveNumber(artworks.length)} works
          </p>
          <div className="md:col-span-7 md:col-start-5">
            <h1
              id="archive-heading"
              className="font-display max-w-[10ch] text-[clamp(4rem,10.5vw,11.5rem)] leading-[0.75] tracking-[-0.075em] text-[#e2fffb] uppercase"
            >
              The living
              <br />
              index.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-[#b9e5e1] sm:text-lg">
              A field of biomechanical studies, future myths, and visitors
              recovered from the dark.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-y-18 md:mt-32 md:grid-cols-12 md:gap-x-6 md:gap-y-24">
          {artworks.map((artwork, index) => {
            const [image] = artwork.images
            const imageCount = artwork.images.length

            return (
              <article
                key={artwork.id}
                className={`group relative ${layouts[index % layouts.length]}`}
              >
                <Link
                  href={`/gallery/${artwork.id}`}
                  aria-label={`Open ${artwork.title}, ${imageCount} images`}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-[#83e9e3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#051519]"
                >
                  <figure>
                    <div
                      className="relative isolate overflow-visible"
                      style={{
                        aspectRatio: `${image.width} / ${image.height}`,
                      }}
                    >
                      {imageCount > 1 ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 translate-x-3 translate-y-3 border border-[#83e9e3]/25 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5 motion-reduce:transition-none"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#83e9e3]/35 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3 motion-reduce:transition-none"
                          />
                        </>
                      ) : null}
                      <div className="absolute inset-0 overflow-hidden bg-[#12363b]">
                        <Image
                          src={image.src}
                          alt={image.alt || artwork.description}
                          fill
                          priority={index === 0}
                          sizes="(min-width: 1280px) 42vw, (min-width: 768px) 55vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                        />
                      </div>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(3,15,18,0.78)_100%)] opacity-75"
                      />
                      <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 p-4 font-mono text-[9px] font-medium tracking-[0.14em] text-[#d7fffb] uppercase sm:p-5 sm:text-[10px]">
                        <span>Signal {archiveNumber(artwork.id)}</span>
                        <span>01 / {archiveNumber(imageCount)}</span>
                      </div>
                    </div>
                    <figcaption className="relative z-10 mt-5 flex max-w-[28rem] items-start justify-between gap-5 border-t border-[#75d9d3]/30 pt-3">
                      <div>
                        <p className="font-mono text-[9px] font-medium tracking-[0.15em] text-[#8ce7e1] uppercase sm:text-[10px]">
                          {artwork.year} / record {archiveNumber(artwork.id)}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#b9e5e1] sm:text-base">
                          {artwork.description}
                        </p>
                      </div>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 28 28"
                        fill="none"
                        className="mt-0.5 size-7 shrink-0 text-[#62d8d0]/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
                      >
                        <path
                          d="M7 21 21 7M10 7h11v11"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="square"
                        />
                      </svg>
                    </figcaption>
                  </figure>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
