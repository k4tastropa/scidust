"use client"

import { upload } from "@vercel/blob/client"
import { useRef, useState } from "react"

import {
  attachUploadedImageAction,
  createArtworkDraftAction,
  publishArtworkAction,
} from "@/app/otherworld/actions"

type Dimensions = { width: number; height: number }

function imageDimensions(file: File) {
  return new Promise<Dimensions>((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("One image could not be read."))
    }
    image.src = objectUrl
  })
}

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "image"
}

export function NewArtworkForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return

    const formData = new FormData(event.currentTarget)
    const files = Array.from(formData.getAll("images")).filter(
      (entry): entry is File => entry instanceof File && entry.size > 0
    )

    if (!files.length || files.length > 12) {
      setStatus("Choose between one and twelve images.")
      return
    }
    if (
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 12 * 1024 * 1024
      )
    ) {
      setStatus("Use JPG, PNG, or WebP files under 12 MB each.")
      return
    }

    setIsSaving(true)
    setStatus("Opening a new signal...")

    try {
      const artwork = await createArtworkDraftAction({
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        publishedAt: String(formData.get("publishedAt") ?? ""),
      })

      for (const [index, file] of files.entries()) {
        setStatus(`Sending image ${index + 1} of ${files.length}...`)
        const dimensions = await imageDimensions(file)
        const blob = await upload(
          `artwork/upload/${artwork.archiveNumber}/${safeFilename(file.name)}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/otherworld/upload",
            clientPayload: JSON.stringify({ artworkId: artwork.id }),
          }
        )

        await attachUploadedImageAction({
          artworkId: artwork.id,
          pathname: blob.pathname,
          url: blob.url,
          contentType: blob.contentType,
          position: index,
          width: dimensions.width,
          height: dimensions.height,
          alt: "",
        })
      }

      await publishArtworkAction(artwork.id)
      window.location.assign(`/otherworld/${artwork.archiveNumber}`)
    } catch {
      setStatus(
        "The upload paused. Any completed files are safe in Blob. Refresh and remove the incomplete draft before trying again."
      )
      setIsSaving(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
          Title
          <input
            name="title"
            maxLength={160}
            className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none placeholder:text-[#a7e5df]/35 focus:border-[#a7e5df]"
            placeholder="Optional signal name"
          />
        </label>
        <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
          Date
          <input
            name="publishedAt"
            type="date"
            className="h-11 border border-[#a7e5df]/35 bg-transparent px-3 font-mono text-xs tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df]"
          />
        </label>
      </div>
      <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
        Caption
        <textarea
          name="description"
          maxLength={5000}
          rows={5}
          className="resize-y border border-[#a7e5df]/35 bg-transparent p-3 font-sans text-sm leading-relaxed tracking-normal text-[#effffd] outline-none placeholder:text-[#a7e5df]/35 focus:border-[#a7e5df]"
          placeholder="The words that travel with this work."
        />
      </label>
      <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
        Carousel images
        <input
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          className="min-h-12 border border-dashed border-[#a7e5df]/45 bg-[#a7e5df]/5 px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-[#a7e5df] file:mr-4 file:border-0 file:bg-[#a7e5df] file:px-3 file:py-2 file:font-mono file:text-[10px] file:tracking-[0.12em] file:text-[#061413] file:uppercase hover:border-[#a7e5df] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="min-h-11 bg-[#a7e5df] px-4 font-mono text-[10px] tracking-[0.15em] text-[#061413] uppercase transition-colors hover:bg-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? "Sending" : "Add to archive"}
        </button>
        {status ? (
          <p aria-live="polite" className="font-mono text-[10px] tracking-[0.06em] text-[#a7e5df]/70">
            {status}
          </p>
        ) : null}
      </div>
    </form>
  )
}
