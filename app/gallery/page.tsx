import type { Metadata } from "next"

import { LivingIndex } from "@/components/living-index"
import { getArtworks } from "@/lib/artwork"

export const metadata: Metadata = {
  title: "Gallery | SCIDUST",
  description: "The living index of SCIDUST artworks.",
}

export default async function GalleryPage() {
  const artworks = await getArtworks()

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
