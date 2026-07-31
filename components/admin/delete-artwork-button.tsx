"use client"

import { useTransition } from "react"

import { deleteArtworkAction } from "@/app/otherworld/actions"

export function DeleteArtworkButton({ archiveNumber }: { archiveNumber: number }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          window.confirm(
            "Delete this artwork and every image in its carousel? This cannot be undone."
          )
        ) {
          startTransition(async () => {
            await deleteArtworkAction(archiveNumber)
            window.location.assign("/otherworld")
          })
        }
      }}
      className="min-h-11 border border-[#ff746d]/50 px-3 font-mono text-[10px] tracking-[0.13em] text-[#ff9d98] uppercase transition-colors hover:bg-[#ff746d] hover:text-[#130706] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:opacity-50"
    >
      {isPending ? "Erasing" : "Delete artwork"}
    </button>
  )
}
