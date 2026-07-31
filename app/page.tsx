import Image from "next/image"
import Link from "next/link"

import { getArtworks } from "@/lib/artwork"

export default async function Page() {
  const artworks = await getArtworks()
  const artwork58 = artworks.find((artwork) => artwork.id === 58)
  const artwork52 = artworks.find((artwork) => artwork.id === 52)
  const artwork41 = artworks.find((artwork) => artwork.id === 41)

  if (!artwork58 || !artwork52 || !artwork41) {
    throw new Error("Homepage artwork is missing from the archive.")
  }

  return (
    <main id="content" className="bg-[#051519] text-[#e2fffb]">
      <section
        aria-labelledby="hero-title"
        className="relative isolate h-[calc(100svh-15rem)] overflow-hidden md:h-[calc(100svh-8rem)]"
      >
        <div className="absolute inset-y-0 right-0 left-0 md:left-[31%]">
          <Image
            src={artwork58.images[0].src}
            alt="A luminous cybernetic figure with glass-like facial fragments and electric cyan hair."
            fill
            priority
            sizes="(min-width: 1280px) 69vw, (min-width: 768px) 76vw, 100vw"
            className="object-cover object-[62%_38%]"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,15,18,0.22)_0%,rgba(3,15,18,0.78)_64%,#051519_100%)] md:bg-[linear-gradient(90deg,#030f12_0%,rgba(3,15,18,0.98)_31%,rgba(3,15,18,0.75)_46%,rgba(3,15,18,0.13)_72%,rgba(3,15,18,0.12)_100%),linear-gradient(180deg,transparent_0%,rgba(5,21,25,0.18)_56%,#051519_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(149,255,246,0.45)_1px,transparent_0)] [background-size:8px_8px] opacity-20"
        />
        <div
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[11%] left-[2%] text-[clamp(15rem,31vw,32rem)] leading-none tracking-[-0.12em] text-transparent [-webkit-text-stroke:1px_rgba(127,245,237,0.2)]"
        >
          01
        </div>

        <div className="relative mx-auto flex h-[calc(100svh-15rem)] max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:h-[calc(100svh-8rem)] md:px-12 md:py-10 xl:px-16">
          <div className="flex items-start justify-between gap-8 font-mono text-[9px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase sm:text-[10px]">
            <p>3D CGI / Tbilisi, GE</p>
            <p className="hidden text-right md:block">Signal 01 / 2025</p>
          </div>

          <div className="my-auto max-w-xl py-14 md:py-20">
            <p className="mb-5 font-mono text-[10px] font-medium tracking-[0.18em] text-[#83e9e3] uppercase sm:text-[11px]">
              Tatia / Scidust9
            </p>
            <h1
              id="hero-title"
              className="font-display max-w-[9ch] text-[clamp(3.6rem,8.2vw,8.8rem)] leading-[0.79] tracking-[-0.065em] text-[#e2fffb] uppercase"
            >
              Anatomy
              <br />
              after
              <br />
              human.
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[#c1eeeb] sm:text-lg">
              Tatia builds surreal, biomechanical worlds where skin meets
              circuitry. Cinematic figures, metallic relics, and future myths
              rendered in impossible light.
            </p>
          </div>
        </div>
        <a
          href="#dream"
          aria-label="Scroll to the dream archive"
          className="group absolute right-5 bottom-5 z-10 flex min-h-12 min-w-12 items-end gap-3 px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#83e9e3] sm:right-8 sm:bottom-8 md:right-12 md:bottom-10 xl:right-16"
        >
          <span className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#9af6ef] uppercase transition-opacity duration-200 group-hover:opacity-70 group-focus-visible:opacity-70 motion-reduce:transition-none">
            Continue
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-[#9af6ef]/40">
            <span className="scroll-signal-pulse absolute -top-3 left-0 h-3 w-px bg-[#9af6ef]" />
          </span>
        </a>
      </section>

      <section
        id="dream"
        aria-labelledby="dream-title"
        className="relative isolate h-[100svh] overflow-hidden bg-[#051519]"
      >
        <div className="absolute inset-y-0 right-0 left-0 md:[mask-image:linear-gradient(90deg,#000_0%,#000_42%,rgba(0,0,0,0.78)_56%,transparent_82%)]">
          <Image
            src={artwork52.images[0].src}
            alt="Three biomechanical figures gathered in teal underwater light."
            fill
            sizes="100vw"
            className="object-cover object-[42%_48%]"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#051519_0%,#051519_10%,rgba(5,21,25,0.16)_42%,rgba(5,21,25,0.86)_88%,#051519_100%)] md:bg-[linear-gradient(90deg,rgba(5,21,25,0.03)_0%,rgba(5,21,25,0.14)_32%,rgba(5,21,25,0.58)_49%,rgba(5,21,25,0.94)_63%,#051519_75%,#051519_100%),linear-gradient(180deg,#051519_0%,#051519_10%,rgba(5,21,25,0.55)_20%,rgba(5,21,25,0)_37%,rgba(5,21,25,0.32)_78%,#051519_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-[20%] left-[12%] h-[56%] w-[70%] rounded-full bg-[#17cfc3]/10 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[10%] left-[2%] text-[clamp(15rem,31vw,32rem)] leading-none tracking-[-0.12em] text-transparent [-webkit-text-stroke:1px_rgba(127,245,237,0.2)]"
        >
          02
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 700 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-[6%] left-0 h-[88%] w-[67%] text-[#80f4ed] opacity-40 mix-blend-screen md:w-[59%]"
        >
          <path
            d="M76 834C57 654 119 417 268 196C340 90 442 48 538 91C656 144 667 364 600 553C543 714 423 872 252 929C155 961 92 914 76 834Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M137 799C113 630 166 417 292 249C374 140 472 114 544 164C626 220 608 398 548 548C491 694 390 815 268 850C194 871 148 844 137 799Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 8"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M76 834C223 763 375 535 538 91M137 799C264 675 418 418 544 164"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="292" cy="249" r="8" fill="#80f4ed" />
          <circle cx="548" cy="548" r="5" fill="#80f4ed" />
          <circle cx="252" cy="929" r="5" fill="#80f4ed" />
        </svg>

        <div className="relative mx-auto flex h-[100svh] max-w-[1600px] flex-col px-5 pb-16 sm:px-8 md:px-12 md:pb-20 xl:px-16">
          <p className="pt-5 font-mono text-[9px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase sm:pt-7 sm:text-[10px] md:ml-auto md:w-[44%] md:pt-9">
            Dream archive / 02
          </p>

          <div className="mt-auto max-w-xl pb-4 md:ml-auto md:w-[44%] md:max-w-none md:pb-12">
            <p className="mb-5 font-mono text-[10px] font-medium tracking-[0.18em] text-[#83e9e3] uppercase sm:text-[11px]">
              Latenight whispers
            </p>
            <h2
              id="dream-title"
              className="font-display max-w-[10ch] text-[clamp(3.35rem,6.5vw,7.3rem)] leading-[0.81] tracking-[-0.065em] text-[#e2fffb] uppercase"
            >
              I make room
              <br />
              for the
              <br />
              visitors.
            </h2>
            <div className="mt-7 max-w-md space-y-4 text-base leading-relaxed text-[#c1eeeb] sm:text-lg">
              <p>
                These figures came to me in dreams when I was a child. They were
                quiet, luminous, and already familiar.
              </p>
              <p>
                Now I build rooms for them from skin, circuitry, and impossible
                light. Every image is an attempt to let them stay a little
                longer.
              </p>
            </div>
          </div>
        </div>
        <a
          href="#collection"
          aria-label="Scroll to the gallery and print options"
          className="group absolute right-5 bottom-5 z-10 flex min-h-12 min-w-12 items-end gap-3 px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#83e9e3] sm:right-8 sm:bottom-8 md:right-12 md:bottom-10 xl:right-16"
        >
          <span className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#9af6ef] uppercase transition-opacity duration-200 group-hover:opacity-70 group-focus-visible:opacity-70 motion-reduce:transition-none">
            Continue
          </span>
          <span className="relative h-10 w-px overflow-hidden bg-[#9af6ef]/40">
            <span className="scroll-signal-pulse absolute -top-3 left-0 h-3 w-px bg-[#9af6ef]" />
          </span>
        </a>
      </section>

      <section
        id="collection"
        aria-labelledby="collection-title"
        className="relative isolate h-[100svh] overflow-hidden bg-[#e8ece8] text-[#10272c]"
      >
        <div className="absolute inset-y-0 right-0 left-0 md:left-[34%] md:[mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.68)_24%,#000_50%,#000_100%)]">
          <Image
            src={artwork41.images[0].src}
            alt="A silver haired figure with closed eyes, intricate gold adornments, and a ceremonial metal crown."
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover object-[52%_48%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#051519_0%,rgba(5,21,25,0.9)_9%,rgba(41,63,65,0.54)_20%,rgba(232,236,232,0.18)_39%,rgba(232,236,232,0.94)_100%)] md:bg-[linear-gradient(90deg,#e8ece8_0%,#e8ece8_39%,rgba(232,236,232,0.8)_53%,rgba(232,236,232,0.14)_70%,rgba(232,236,232,0.06)_100%),linear-gradient(180deg,#051519_0%,rgba(5,21,25,0.78)_10%,rgba(54,83,84,0.44)_22%,rgba(232,236,232,0)_42%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[20%] h-px bg-[#10272c]/20 md:top-[26%]"
        />
        <div
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[10%] left-[2%] text-[clamp(15rem,31vw,32rem)] leading-none tracking-[-0.12em] text-transparent [-webkit-text-stroke:1px_rgba(16,39,44,0.16)]"
        >
          03
        </div>

        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:px-12 md:py-10 xl:px-16">
          <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#b8e4df] uppercase sm:text-[10px]">
            Transmission complete / 03
          </p>

          <div className="my-auto max-w-xl py-12 md:py-20">
            <p className="mb-5 font-mono text-[10px] font-medium tracking-[0.18em] text-[#35636b] uppercase sm:text-[11px]">
              Keep a piece of the signal
            </p>
            <h2
              id="collection-title"
              className="font-display max-w-[9ch] text-[clamp(3.6rem,7.1vw,8rem)] leading-[0.8] tracking-[-0.065em] uppercase"
            >
              Take the
              <br />
              unreal
              <br />
              with you.
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[#31585e] sm:text-lg">
              Wander the archive, or ask about a print made to live beyond the
              screen.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 font-mono text-xs font-medium tracking-[0.1em] uppercase">
              <Link
                href="/gallery"
                className="inline-flex min-h-12 items-center justify-center border border-[#10272c] bg-[#10272c] px-6 text-[#e8ece8] transition-colors duration-200 hover:bg-[#24bdb6] hover:text-[#10272c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10272c] motion-reduce:transition-none"
              >
                Enter gallery
              </Link>
              <Link
                href="/contact?subject=print"
                className="inline-flex min-h-12 items-center justify-center border border-[#10272c] px-6 transition-colors duration-200 hover:bg-[#d2ebe8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10272c] motion-reduce:transition-none"
              >
                Request a print
              </Link>
            </div>
          </div>

          <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#35636b] uppercase sm:text-[10px]">
            SCIDUST / open archive
          </p>
        </div>
      </section>
    </main>
  )
}
