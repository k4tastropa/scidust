import type { Metadata } from "next"

import { LivingIndex } from "@/components/living-index"
import { getArtworks } from "@/lib/artwork"

export const metadata: Metadata = {
  title: "3D Art Gallery & Biomechanical Archive",
  description:
    "Explore the complete 3D digital art archive by Tatia (Scidust9), 3D artist in Tbilisi, Georgia. Biomechanical sculptures, surreal anatomies, and CGI concept designs.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "3D Art Gallery & Biomechanical Archive | Tatia (Scidust9)",
    description:
      "Explore 3D digital sculptures and surreal biomechanical artworks by Tatia (Scidust9) in Tbilisi, Georgia.",
    url: "/gallery",
  },
}

export default async function GalleryPage() {
  const artworks = await getArtworks()

  if (!artworks.length) {
    return (
      <main id="content" className="bg-[#051519] text-[#e2fffb]">
        <section className="relative isolate flex min-h-[calc(100svh-8rem)] overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(126,239,231,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(126,239,231,0.11)_1px,transparent_1px)] [background-size:72px_72px] opacity-35"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[18%] right-[8%] h-[46vw] max-h-[34rem] w-[46vw] max-w-[34rem] rounded-full border border-[#8ce7e1]/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[27%] right-[16%] h-[28vw] max-h-[22rem] w-[28vw] max-w-[22rem] rounded-full border border-[#f4988f]/30"
          />

          <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:px-12 md:py-10 xl:px-16">
            <div className="flex items-start justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase sm:text-[10px]">
              <p>Archive protocol / paused</p>
              <p className="text-right text-[#f4988f]">Signal 00</p>
            </div>

            <div className="my-auto py-12">
              <p className="mb-5 font-mono text-[10px] font-medium tracking-[0.18em] text-[#f4988f] uppercase sm:text-[11px]">
                Field under reconstruction
              </p>
              <h1 className="font-display text-[clamp(5rem,18vw,18rem)] leading-[0.68] tracking-[-0.095em] uppercase">
                Empty
              </h1>
              <div className="relative z-10 -mx-5 mt-5 overflow-hidden bg-[#e2fffb] px-5 py-[0.13em] text-[#051519] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12 xl:-mx-16 xl:px-16">
                <p className="font-display text-[clamp(5rem,18vw,18rem)] leading-[0.68] tracking-[-0.095em] whitespace-nowrap uppercase">
                  Empty
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] uppercase sm:text-[10px]">
              <p className="max-w-[34ch] leading-relaxed text-[#c1eeeb]">
                The artist had a PMS attack and had to reorganize everything.
              </p>
              <p className="text-right text-[#8ce7e1]/70">
                The archive will return
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main
      id="content"
      className="relative isolate overflow-x-clip bg-[#051519] pt-14 text-[#e2fffb] md:pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(126,239,231,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(126,239,231,0.11)_1px,transparent_1px)] [background-size:72px_72px] opacity-35"
      />
      <LivingIndex artworks={artworks} />
    </main>
  )
}
