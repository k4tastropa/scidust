import type { Metadata } from "next"
import Image from "next/image"

import { getArtworks } from "@/lib/artwork"
import { getContactSettings } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Contact | SCIDUST",
  description: "Contact SCIDUST on Instagram or by email.",
}

export default async function ContactPage() {
  const [artworks, contact] = await Promise.all([
    getArtworks(),
    getContactSettings(),
  ])
  const artwork30 = artworks.find((artwork) => artwork.id === 30)

  if (!artwork30) {
    throw new Error("Contact artwork is missing from the archive.")
  }

  return (
    <main id="content" className="bg-[#050505] text-[#effffd]">
      <section className="relative isolate min-h-[calc(100svh-15rem)] overflow-hidden md:min-h-[calc(100svh-8rem)]">
        <div className="absolute top-0 right-0 left-0 h-[60svh] md:inset-y-0 md:right-[34%] md:h-auto">
          <Image
            src={artwork30.images[0].src}
            alt="A cybernetic figure in profile facing toward the contact channels."
            fill
            priority
            sizes="(min-width: 768px) 66vw, 72vw"
            className="object-cover object-[64%_50%]"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.02)_0%,rgba(5,5,5,0.08)_44%,rgba(5,5,5,0.55)_67%,#050505_92%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0)_39%,rgba(5,5,5,0.46)_54%,#050505_72%,#050505_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-[57%] hidden w-px bg-[linear-gradient(180deg,transparent_0%,rgba(244,72,64,0.66)_40%,rgba(122,244,235,0.48)_70%,transparent_100%)] md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[30%] left-[51%] hidden h-px w-[45%] bg-[#f44840]/55 md:block"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-15rem)] max-w-[1600px] flex-col px-5 py-6 sm:px-8 md:min-h-[calc(100svh-8rem)] md:px-12 md:py-10 xl:px-16">
          <div className="flex items-start justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df] uppercase sm:text-[10px] md:ml-auto md:w-[41%]">
            <p>Open channel</p>
            <p className="text-right text-[#f4988f]">Contact / 30</p>
          </div>

          <div className="mt-[46svh] w-full pb-10 md:my-auto md:ml-auto md:w-[41%] md:pb-0">
            <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-[#f4988f] uppercase sm:text-[11px]">
              Signal received here
            </p>
            <h1 className="font-display mt-5 max-w-[8ch] text-[clamp(3.8rem,6.8vw,7.6rem)] leading-[0.8] tracking-[-0.065em] uppercase">
              Say
              <br />
              something
              <br />
              strange.
            </h1>

            <div className="mt-9 border-t border-[#a7e5df]/35">
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-18 items-center justify-between gap-4 border-b border-[#a7e5df]/35 py-4 transition-colors duration-200 outline-none hover:text-[#f4988f] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-inset motion-reduce:transition-none"
              >
                <span>
                  <span className="block font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df] uppercase sm:text-[10px]">
                    Instagram
                  </span>
                  <span className="font-display mt-1 block text-[clamp(1.9rem,3vw,3.1rem)] leading-none tracking-[-0.05em]">
                    {contact.instagramUrl
                      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")
                      .replace(/\/$/, "")}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="size-7 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
                >
                  <path
                    d="M7 21 21 7M10 7h11v11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="square"
                  />
                </svg>
              </a>

              <a
                href={`mailto:${contact.contactEmail}`}
                className="group flex min-h-18 items-center justify-between gap-4 border-b border-[#a7e5df]/35 py-4 transition-colors duration-200 outline-none hover:text-[#f4988f] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-inset motion-reduce:transition-none"
              >
                <span>
                  <span className="block font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df] uppercase sm:text-[10px]">
                    Email
                  </span>
                  <span className="font-display mt-1 block text-[clamp(1.7rem,2.45vw,2.7rem)] leading-[0.92] tracking-[-0.05em] break-all">
                    {contact.contactEmail}
                  </span>
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="size-7 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
                >
                  <path
                    d="M7 21 21 7M10 7h11v11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
            </div>
          </div>

          <p className="hidden font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df]/70 uppercase md:ml-auto md:block md:w-[41%] md:text-[10px]">
            Every signal reaches somewhere
          </p>
        </div>
      </section>
    </main>
  )
}
