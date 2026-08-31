import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fine Art 3D Prints & Limited Editions",
  description:
    "Limited edition archival prints and physical relics of 3D artworks by Tatia (Scidust9).",
  alternates: {
    canonical: "/prints",
  },
  openGraph: {
    title: "Fine Art 3D Prints & Limited Editions | Tatia (Scidust9)",
    description:
      "Limited edition archival prints and physical relics of 3D artworks by Tatia (Scidust9).",
    url: "/prints",
  },
}

export default function PrintsPage() {
  return (
    <main id="content" className="bg-[#050505] text-[#f5f6f2]">
      <section className="relative isolate flex min-h-[calc(100svh-15rem)] overflow-hidden md:min-h-[calc(100svh-8rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(245,246,242,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(245,246,242,0.16)_1px,transparent_1px)] [background-size:72px_72px] opacity-35"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[18%] right-[9%] h-[38vw] max-h-[32rem] w-[38vw] max-w-[32rem] rounded-full border border-[#f5f6f2]/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[25%] right-[16%] h-[24vw] max-h-[20rem] w-[24vw] max-w-[20rem] rounded-full border border-[#f5f6f2]/20"
        />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:px-12 md:py-10 xl:px-16">
          <div className="flex items-start justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] uppercase sm:text-[10px]">
            <p>Print protocol / suspended</p>
            <p className="text-right text-[#b4bbb7]">Storefront 00</p>
          </div>

          <div className="my-auto py-12">
            <p className="mb-5 font-mono text-[10px] font-medium tracking-[0.18em] text-[#c6ccc8] uppercase sm:text-[11px]">
              Physical matter pending
            </p>
            <h1 className="font-display text-[clamp(4.8rem,16.6vw,18rem)] leading-[0.69] tracking-[-0.095em] uppercase">
              Not ready
            </h1>
            <div className="relative z-10 -mx-5 mt-5 overflow-hidden bg-[#f5f6f2] px-5 py-[0.13em] text-[#050505] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12 xl:-mx-16 xl:px-16">
              <p className="font-display text-[clamp(4.8rem,16.6vw,18rem)] leading-[0.69] tracking-[-0.095em] whitespace-nowrap uppercase">
                Not ready
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] uppercase sm:text-[10px]">
            <p className="max-w-[28ch] leading-relaxed text-[#c6ccc8]">
              The developer did not have time for this.
            </p>
            <p className="text-right text-[#b4bbb7]">
              Please return to the archive
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
