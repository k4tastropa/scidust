"use client"

import { Trash } from "@phosphor-icons/react"
import { useTransition } from "react"

import { deleteArtworkAction } from "@/app/otherworld/actions"

export function DeleteArtworkButton({
  archiveNumber,
}: {
  archiveNumber: number
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label="Delete artwork"
      title="Delete artwork"
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
      className="flex size-11 touch-manipulation items-center justify-center border border-[#ff746d]/50 text-[#ff9d98] transition-colors hover:bg-[#ff746d] hover:text-[#130706] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
    >
      <Trash aria-hidden="true" size={18} />
      <span className="sr-only">
        {isPending ? "Deleting artwork" : "Delete artwork"}
      </span>
    </button>
  )
}
