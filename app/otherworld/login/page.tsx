import { redirect } from "next/navigation"

import { loginAction } from "@/app/otherworld/actions"
import { getAdminSession } from "@/lib/admin-auth"

export const metadata = {
  title: "Otherworld | SCIDUST",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getAdminSession()
  if (session) {
    redirect("/otherworld")
  }
  const { error } = await searchParams

  return (
    <main id="content" className="min-h-[calc(100svh-8rem)] bg-[#050505] px-5 py-12 text-[#effffd] sm:px-8 md:px-12 md:py-18">
      <section className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.65fr)] md:items-end">
        <div className="min-h-55 border-t border-[#a7e5df]/45 pt-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#a7e5df] uppercase">
            Restricted signal
          </p>
          <h1 className="font-display mt-5 max-w-[7ch] text-[clamp(4.5rem,10vw,10rem)] leading-[0.73] tracking-[-0.07em] uppercase">
            Other world
          </h1>
        </div>

        <form action={loginAction} className="border border-[#a7e5df]/35 bg-[#0a1110] p-5 sm:p-7">
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#f4988f] uppercase">
            Archive access
          </p>
          <div className="mt-8 grid gap-5">
            <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
              Username
              <input
                name="username"
                autoComplete="username"
                required
                className="h-12 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]"
              />
            </label>
            <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-12 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]"
              />
            </label>
          </div>
          {error ? (
            <p role="alert" className="mt-4 font-mono text-[10px] tracking-[0.06em] text-[#ff9d98]">
              Access was not granted. Try again later.
            </p>
          ) : null}
          <button className="mt-7 min-h-12 w-full bg-[#a7e5df] px-4 font-mono text-[10px] tracking-[0.16em] text-[#061413] uppercase transition-colors hover:bg-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] focus-visible:outline-none">
            Enter archive
          </button>
        </form>
      </section>
    </main>
  )
}
