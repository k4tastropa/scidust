import type { Metadata } from "next"
import Image from "next/image"

import { getContactSettings } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Contact & 3D Commissions",
  description:
    "Get in touch with Tatia (Scidust9) for 3D CGI art, biomechanical concept design, commercial commissions, and visual collaborations in Tbilisi, Georgia.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & 3D Commissions | Tatia (Scidust9)",
    description:
      "Get in touch with Tatia (Scidust9) for 3D CGI art, concept design, and creative commissions in Tbilisi, Georgia.",
    url: "/contact",
  },
}

export default async function ContactPage() {
  const contact = await getContactSettings()

  return (
    <main id="content" className="bg-[#050505] text-[#effffd]">
      <section className="relative isolate overflow-hidden bg-[#050505] md:min-h-[calc(100svh-8rem)]">
        <div className="relative h-[62svh] md:absolute md:inset-y-0 md:right-[34%] md:left-0 md:h-auto md:-translate-x-[14%]">
          <Image
            src="/04.png"
            alt="A cybernetic figure in profile facing toward the contact channels."
            fill
            priority
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover object-[64%_50%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0.08)_38%,#050505_100%)] md:hidden"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0)_39%,rgba(5,5,5,0.46)_54%,#050505_72%,#050505_100%)] md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-[57%] hidden w-px bg-[linear-gradient(180deg,transparent_0%,rgba(244,72,64,0.66)_40%,rgba(122,244,235,0.48)_70%,transparent_100%)] md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[30%] left-[51%] hidden h-px w-[45%] bg-[#f44840]/55 md:block"
        />

        <div className="relative z-10 mx-auto -mt-20 flex max-w-[1600px] flex-col px-5 pb-12 sm:px-8 md:mt-0 md:min-h-[calc(100svh-8rem)] md:px-12 md:py-10 xl:px-16">
          <div
            aria-hidden="true"
            className="mb-8 h-px w-full bg-[linear-gradient(90deg,#f44840_0%,rgba(244,72,64,0.72)_18%,rgba(122,244,235,0.42)_64%,transparent_100%)] md:hidden"
          />
          <div className="flex items-start justify-between gap-6 font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df] uppercase sm:text-[10px] md:ml-auto md:w-[41%]">
            <p>Open channel</p>
            <p className="text-right text-[#f4988f]">Contact / 30</p>
          </div>

          <div className="mt-16 w-full pb-10 md:my-auto md:ml-auto md:w-[41%] md:pb-0">
            <p className="font-mono text-[10px] font-medium tracking-[0.18em] text-[#f4988f] uppercase sm:text-[11px]">
              Direct channel & commissions
            </p>
            <h1 className="font-display mt-5 max-w-[8ch] text-[clamp(3.25rem,14vw,4.35rem)] leading-[0.8] tracking-[-0.065em] text-balance uppercase md:text-[clamp(3.8rem,6.8vw,7.6rem)]">
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
                className="group flex min-h-18 touch-manipulation items-center justify-between gap-4 border-b border-[#a7e5df]/35 py-4 transition-colors duration-200 outline-none hover:text-[#f4988f] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-inset motion-reduce:transition-none"
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
                href={contact.behanceUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-18 touch-manipulation items-center justify-between gap-4 border-b border-[#a7e5df]/35 py-4 transition-colors duration-200 outline-none hover:text-[#f4988f] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-inset motion-reduce:transition-none"
              >
                <span>
                  <span className="block font-mono text-[9px] font-medium tracking-[0.16em] text-[#a7e5df] uppercase sm:text-[10px]">
                    Behance
                  </span>
                  <span className="font-display mt-1 block text-[clamp(1.9rem,3vw,3.1rem)] leading-none tracking-[-0.05em]">
                    {contact.behanceUrl
                      .replace(/^https?:\/\/(www\.)?behance\.net\//, "@")
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
                className="group flex min-h-18 touch-manipulation items-center justify-between gap-4 border-b border-[#a7e5df]/35 py-4 transition-colors duration-200 outline-none hover:text-[#f4988f] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-inset motion-reduce:transition-none"
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
            Available for worldwide projects & commissions
          </p>
        </div>
      </section>
    </main>
  )
}
