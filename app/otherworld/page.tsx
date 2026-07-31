import Image from "next/image"
import Link from "next/link"

import {
  changePasswordAction,
  logoutAction,
  moveArtworkAction,
  updateContactAction,
} from "@/app/otherworld/actions"
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button"
import { NewArtworkForm } from "@/components/admin/new-artwork-form"
import { requireAdmin } from "@/lib/admin-auth"
import { getArtworks } from "@/lib/artwork"
import { getContactSettings } from "@/lib/site-settings"

export const metadata = {
  title: "Otherworld | SCIDUST",
  robots: { index: false, follow: false },
}

export default async function OtherworldPage({
  searchParams,
}: {
  searchParams: Promise<{
    contactSaved?: string
    contactError?: string
    passwordSaved?: string
    passwordError?: string
  }>
}) {
  await requireAdmin()
  const [artworks, contact, notices] = await Promise.all([
    getArtworks(),
    getContactSettings(),
    searchParams,
  ])

  return (
    <main id="content" className="min-h-[calc(100svh-8rem)] bg-[#050505] text-[#effffd]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 md:px-12 md:py-11 xl:px-16">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[#a7e5df]/40 pb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#a7e5df] uppercase">
              Private control room
            </p>
            <h1 className="font-display mt-3 text-[clamp(3.1rem,7vw,7rem)] leading-[0.78] tracking-[-0.065em] uppercase">
              Archive field
            </h1>
          </div>
          <form action={logoutAction}>
            <button className="min-h-11 border border-[#a7e5df]/45 px-3 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none">
              Log off
            </button>
          </form>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
          <div className="border-t border-[#f4988f]/65 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-4xl tracking-[-0.05em] uppercase">New work</h2>
              <p className="font-mono text-[10px] tracking-[0.12em] text-[#f4988f] uppercase">Blob direct</p>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#d4e9e6]/75">
              Each file moves directly into the archive. The order you choose becomes the carousel order.
            </p>
            <div className="mt-7">
              <NewArtworkForm />
            </div>
          </div>

          <div className="grid gap-10">
            <section className="border-t border-[#a7e5df]/45 pt-4">
              <h2 className="font-display text-3xl tracking-[-0.05em] uppercase">Contact channels</h2>
              <form action={updateContactAction} className="mt-5 grid gap-4">
                <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
                  Instagram URL
                  <input name="instagramUrl" type="url" required defaultValue={contact.instagramUrl} className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" />
                </label>
                <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
                  Email
                  <input name="email" type="email" required defaultValue={contact.contactEmail} className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" />
                </label>
                <button className="min-h-11 justify-self-start border border-[#a7e5df]/45 px-3 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none">Save channels</button>
                {notices.contactSaved ? <p aria-live="polite" className="font-mono text-[10px] text-[#a7e5df]">Channels saved.</p> : null}
                {notices.contactError ? <p role="alert" className="font-mono text-[10px] text-[#ff9d98]">Check the email and Instagram URL.</p> : null}
              </form>
            </section>

            <section className="border-t border-[#a7e5df]/45 pt-4">
              <h2 className="font-display text-3xl tracking-[-0.05em] uppercase">Password</h2>
              <form action={changePasswordAction} className="mt-5 grid gap-4">
                <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">Current password<input name="currentPassword" type="password" autoComplete="current-password" required className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" /></label>
                <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">New password<input name="nextPassword" type="password" autoComplete="new-password" minLength={12} required className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]" /></label>
                <button className="min-h-11 justify-self-start border border-[#a7e5df]/45 px-3 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none">Change password</button>
                {notices.passwordSaved ? <p aria-live="polite" className="font-mono text-[10px] text-[#a7e5df]">Password changed. Other sessions are closed.</p> : null}
                {notices.passwordError ? <p role="alert" className="font-mono text-[10px] text-[#ff9d98]">Use the current password and a new password of at least twelve characters.</p> : null}
              </form>
            </section>
          </div>
        </section>

        <section className="mt-16 border-t border-[#a7e5df]/45 pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-[clamp(2.7rem,5vw,5rem)] tracking-[-0.06em] uppercase">Archive order</h2>
            <p className="font-mono text-[10px] tracking-[0.13em] text-[#a7e5df]/70 uppercase">{artworks.length} published signals</p>
          </div>
          <div className="mt-6 grid border-t border-l border-[#a7e5df]/25 sm:grid-cols-2 xl:grid-cols-3">
            {artworks.map((artwork, index) => (
              <article key={artwork.id} className="group border-r border-b border-[#a7e5df]/25 p-3 sm:p-4">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1110]">
                  <Image src={artwork.images[0].src} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none" />
                  <span className="absolute top-2 left-2 bg-[#050505]/85 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[#a7e5df]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-mono text-[10px] tracking-[0.13em] text-[#f4988f] uppercase">Archive {String(artwork.id).padStart(2, "0")}</p><h3 className="font-display mt-1 truncate text-2xl tracking-[-0.05em]">{artwork.title}</h3></div>
                  <Link href={`/otherworld/${artwork.id}`} className="shrink-0 border border-[#a7e5df]/35 px-2 py-2 font-mono text-[9px] tracking-[0.12em] text-[#a7e5df] uppercase transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none">Edit</Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={moveArtworkAction}><input type="hidden" name="archiveNumber" value={artwork.id} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="min-h-10 border border-[#a7e5df]/30 px-2 font-mono text-[9px] tracking-[0.1em] text-[#a7e5df] uppercase disabled:opacity-25">Earlier</button></form>
                  <form action={moveArtworkAction}><input type="hidden" name="archiveNumber" value={artwork.id} /><input type="hidden" name="direction" value="down" /><button disabled={index === artworks.length - 1} className="min-h-10 border border-[#a7e5df]/30 px-2 font-mono text-[9px] tracking-[0.1em] text-[#a7e5df] uppercase disabled:opacity-25">Later</button></form>
                  <DeleteArtworkButton archiveNumber={artwork.id} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
