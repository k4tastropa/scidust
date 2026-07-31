import Link from "next/link"

const navigation = [
  { href: "/", label: "Home", index: "01" },
  { href: "/gallery", label: "Gallery", index: "02" },
  { href: "/prints", label: "Prints", index: "03" },
  { href: "/contact", label: "Contact", index: "04" },
]

export function SiteHeader() {
  return (
    <header className="relative z-20 overflow-hidden border-b border-[#75d9d3]/60 bg-[#051519] text-[#e2fffb]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,transparent_49.8%,currentColor_50%,transparent_50.2%)] [background-size:9px_100%] opacity-10"
      />
      <nav
        aria-label="Primary navigation"
        className="relative mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]"
      >
        <Link
          href="/"
          className="group relative flex min-h-20 touch-manipulation items-center overflow-hidden border-b border-[#75d9d3]/60 bg-[#12c9c5] px-5 py-3 text-[#051519] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#e2fffb] focus-visible:ring-inset md:min-h-32 md:border-b-0 md:px-8 md:py-4"
          aria-label="SCIDUST, home"
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-7 size-18 -translate-y-1/2 rounded-full border border-current opacity-35 transition-transform duration-300 group-hover:scale-[1.75] group-focus-visible:scale-[1.75] motion-reduce:transition-none md:size-24"
          />
          <span className="relative flex min-w-0 flex-col items-start gap-1.5">
            <span className="font-display text-[2.25rem] leading-[0.82] tracking-[-0.045em] md:text-[clamp(2.25rem,5vw,4.8rem)]">
              SCIDUST
            </span>
            <span className="hidden pl-0.5 font-mono text-[9px] font-medium tracking-[0.16em] uppercase opacity-75 sm:block sm:text-[10px]">
              Otherworldly matter studies
            </span>
          </span>
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-5 -translate-y-1/2 font-mono text-[9px] tracking-[0.18em] opacity-55 md:top-7 md:right-8 md:translate-y-0"
          >
            41°43′N
          </span>
        </Link>

        <div className="grid grid-cols-4 md:grid-cols-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === "/" ? "page" : undefined}
              className="group relative flex min-h-14 touch-manipulation items-center justify-center overflow-hidden border-r border-[#75d9d3]/60 px-2 py-2 transition-colors duration-200 outline-none last:border-r-0 hover:bg-[#12c9c5] hover:text-[#051519] focus-visible:bg-[#12c9c5] focus-visible:text-[#051519] focus-visible:ring-2 focus-visible:ring-[#e2fffb] focus-visible:ring-inset md:min-h-32 md:min-w-28 md:flex-col md:items-stretch md:justify-between md:px-5 md:py-5"
            >
              <span className="hidden font-mono text-[9px] tracking-[0.14em] opacity-55 md:block">
                {item.index}
              </span>
              <span className="font-mono text-[11px] tracking-[-0.04em] uppercase transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none md:text-sm">
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-[#f4988f] transition-[width] duration-200 group-hover:w-full group-focus-visible:w-full"
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
