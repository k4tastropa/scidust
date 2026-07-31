import Link from "next/link"

const navigation = [
  { href: "/", label: "Home", index: "01" },
  { href: "/gallery", label: "Gallery", index: "02" },
  { href: "/prints", label: "Prints", index: "03" },
  { href: "/contact", label: "Contact", index: "04" },
]

export function SiteHeader() {
  return (
    <header className="relative z-20 overflow-hidden border-b border-foreground/65 bg-background text-foreground">
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
          className="group relative flex min-h-28 items-center overflow-hidden border-b border-foreground/65 bg-primary px-5 py-4 text-primary-foreground transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:min-h-32 md:border-b-0 md:px-8"
          aria-label="SCIDUST, home"
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-7 size-24 -translate-y-1/2 rounded-full border border-current opacity-35 transition-transform duration-300 group-hover:scale-[1.75] group-focus-visible:scale-[1.75] motion-reduce:transition-none"
          />
          <span className="relative flex min-w-0 flex-col items-start gap-1.5">
            <span className="font-display text-[clamp(2.25rem,5vw,4.8rem)] leading-[0.82] tracking-[-0.045em]">
              SCIDUST
            </span>
            <span className="pl-0.5 font-mono text-[9px] font-medium tracking-[0.16em] uppercase opacity-75 sm:text-[10px]">
              Otherworldly matter studies
            </span>
          </span>
          <span
            aria-hidden="true"
            className="absolute top-5 right-5 font-mono text-[9px] tracking-[0.18em] opacity-55 md:top-7 md:right-8"
          >
            41°43′N
          </span>
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === "/" ? "page" : undefined}
              className="group relative flex min-h-16 flex-col justify-between overflow-hidden border-r border-foreground/65 px-4 py-3 transition-colors duration-200 outline-none last:border-r-0 hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:min-h-32 md:min-w-28 md:px-5 md:py-5"
            >
              <span className="font-mono text-[9px] tracking-[0.14em] opacity-55">
                {item.index}
              </span>
              <span className="font-mono text-sm tracking-[-0.04em] uppercase transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-[width] duration-200 group-hover:w-full group-focus-visible:w-full"
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
