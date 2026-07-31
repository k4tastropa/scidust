export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#75d9d3]/35 bg-[#051519] text-[#e2fffb]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,transparent_49.8%,rgba(127,245,237,0.7)_50%,transparent_50.2%)] [background-size:9px_100%] opacity-10"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12 xl:px-16">
        <div className="grid border-b border-[#75d9d3]/30 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
          <div className="flex min-h-28 flex-col justify-between py-5 md:min-h-32 md:py-6">
            <p className="font-mono text-[9px] font-medium tracking-[0.16em] text-[#8ce7e1] uppercase sm:text-[10px]">
              SCIDUST / open archive
            </p>
            <p className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.8] tracking-[-0.06em] uppercase">
              Signal stays.
            </p>
          </div>

          <a
            href="https://k4ta.dev"
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-24 touch-manipulation items-end justify-between gap-5 border-t border-[#75d9d3]/30 py-5 transition-colors duration-200 outline-none hover:bg-[#e2fffb] hover:px-4 hover:text-[#051519] focus-visible:ring-2 focus-visible:ring-[#83e9e3] focus-visible:ring-inset motion-reduce:transition-none md:min-h-32 md:border-t-0 md:border-l md:px-6 md:py-6"
          >
            <span>
              <span className="block font-mono text-[9px] font-medium tracking-[0.16em] uppercase opacity-70 sm:text-[10px]">
                Built with love by
              </span>
              <span className="font-display mt-2 block text-[clamp(2rem,4vw,3.4rem)] leading-[0.82] tracking-[-0.055em]">
                k4ta.dev
              </span>
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 28 28"
              fill="none"
              className="mb-1 size-8 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
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
        <div className="flex min-h-14 items-center justify-between gap-5 font-mono text-[9px] font-medium tracking-[0.14em] text-[#8ce7e1]/70 uppercase sm:text-[10px]">
          <span>3D CGI / Tbilisi, GE</span>
          <span>End of transmission</span>
        </div>
      </div>
    </footer>
  )
}
