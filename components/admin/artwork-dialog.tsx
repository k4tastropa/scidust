"use client"

/* eslint-disable @next/next/no-img-element */

import { Dialog } from "@base-ui/react/dialog"
import {
  ArrowsOutCardinal,
  ArrowLeft,
  ArrowRight,
  FloppyDisk,
  ImageSquare,
  Plus,
  Trash,
  X,
} from "@phosphor-icons/react"
import { upload } from "@vercel/blob/client"
import { useEffect, useRef, useState, type DragEvent } from "react"

import {
  attachUploadedImageAction,
  createArtworkDraftAction,
  publishArtworkAction,
  updateArtworkAction,
} from "@/app/otherworld/actions"
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button"

type Dimensions = { height: number; width: number }

type StoredImage = {
  alt: string
  clientId: string
  height: number
  imageId: number
  url: string
  width: number
}

type PendingImage = {
  clientId: string
  file: File
  height: number
  previewUrl: string
  width: number
}

type CarouselImage = StoredImage | PendingImage

type ExistingArtwork = {
  archiveNumber: number
  databaseId: number
  images: Array<{
    alt: string
    height: number
    id: number
    url: string
    width: number
  }>
  publishedAt: string
  title: string
}

type ArtworkDialogProps = {
  artwork?: ExistingArtwork
}

const MAX_IMAGE_COUNT = 12
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

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

function isPendingImage(image: CarouselImage): image is PendingImage {
  return "file" in image
}

function moveItem<T>(items: T[], from: number, to: number) {
  const nextItems = [...items]
  const [item] = nextItems.splice(from, 1)
  nextItems.splice(to, 0, item)
  return nextItems
}

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "image"
}

export function ArtworkDialog({ artwork }: ArtworkDialogProps) {
  const isEditing = Boolean(artwork)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlsRef = useRef(new Set<string>())
  const [images, setImages] = useState<CarouselImage[]>(
    artwork?.images.map((image) => ({
      alt: image.alt,
      clientId: `saved-${image.id}`,
      height: image.height,
      imageId: image.id,
      url: image.url,
      width: image.width,
    })) ?? []
  )
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const previewUrls = previewUrlsRef.current
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function closeDialog() {
    if (isSaving) return
    if (isEditing) {
      window.location.assign("/otherworld")
      return
    }

    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrlsRef.current.clear()
    formRef.current?.reset()
    setImages([])
    setDraggedIndex(null)
    setStatus(null)
    setIsOpen(false)
  }

  function addImages(files: File[]) {
    if (!files.length) return
    if (files.some((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type))) {
      setStatus("Use JPG, PNG, or WebP images.")
      return
    }
    if (images.length + files.length > MAX_IMAGE_COUNT) {
      setStatus(`An artwork can have up to ${MAX_IMAGE_COUNT} images.`)
      return
    }

    const newImages = files.map((file) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.add(previewUrl)
      return {
        clientId: `new-${crypto.randomUUID()}`,
        file,
        height: 0,
        previewUrl,
        width: 0,
      }
    })
    setImages((current) => [...current, ...newImages])
    setStatus(null)
  }

  function removeImage(image: CarouselImage) {
    if (isPendingImage(image)) {
      URL.revokeObjectURL(image.previewUrl)
      previewUrlsRef.current.delete(image.previewUrl)
    }
    setImages((current) =>
      current.filter((currentImage) => currentImage.clientId !== image.clientId)
    )
  }

  function repositionImage(from: number, to: number) {
    if (to < 0 || to >= images.length || from === to) return
    setImages((current) => moveItem(current, from, to))
  }

  function onDrop(event: DragEvent<HTMLElement>, targetIndex: number) {
    event.preventDefault()
    if (draggedIndex !== null) repositionImage(draggedIndex, targetIndex)
    setDraggedIndex(null)
  }

  async function uploadPendingImages(
    sourceImages: CarouselImage[],
    artworkId: number,
    archiveNumber: number,
    isExistingArtwork: boolean
  ) {
    const uploadedImages = [...sourceImages]

    for (const [index, image] of sourceImages.entries()) {
      if (!isPendingImage(image)) continue

      setStatus(`Sending image ${index + 1} of ${sourceImages.length}...`)
      const dimensions = await imageDimensions(image.file)
      const blob = await upload(
        `artwork/upload/${archiveNumber}/${safeFilename(image.file.name)}`,
        image.file,
        {
          access: "public",
          handleUploadUrl: "/api/otherworld/upload",
          clientPayload: JSON.stringify({ artworkId }),
        }
      )
      const attachedImage = await attachUploadedImageAction({
        artworkId,
        pathname: blob.pathname,
        url: blob.url,
        contentType: blob.contentType,
        position: isExistingArtwork ? 1_000_000 + index : index,
        width: dimensions.width,
        height: dimensions.height,
        alt: "",
      })
      uploadedImages[index] = {
        alt: "",
        clientId: image.clientId,
        height: dimensions.height,
        imageId: attachedImage.id,
        url: blob.url,
        width: dimensions.width,
      }
    }

    return uploadedImages as StoredImage[]
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return
    if (!images.length) {
      setStatus("Keep at least one image in the carousel.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get("title") ?? "")
    const publishedAt = String(formData.get("publishedAt") ?? "")
    setIsSaving(true)
    setStatus(
      isEditing
        ? "Saving artwork and carousel order..."
        : "Opening a new signal..."
    )

    try {
      if (artwork) {
        const savedImages = await uploadPendingImages(
          images,
          artwork.databaseId,
          artwork.archiveNumber,
          true
        )
        await updateArtworkAction({
          archiveNumber: artwork.archiveNumber,
          imageIds: savedImages.map((image) => image.imageId),
          publishedAt,
          title,
        })
      } else {
        const createdArtwork = await createArtworkDraftAction({
          title,
          publishedAt,
        })
        await uploadPendingImages(
          images,
          createdArtwork.id,
          createdArtwork.archiveNumber,
          false
        )
        await publishArtworkAction(createdArtwork.id)
      }

      window.location.assign("/otherworld?artworkSaved=1")
    } catch {
      setStatus(
        "The artwork could not be saved. Check the details and try again."
      )
      setIsSaving(false)
    }
  }

  const dialogTitle = isEditing ? "Edit artwork" : "New artwork"

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeDialog()
        else setIsOpen(true)
      }}
      disablePointerDismissal={isSaving}
    >
      {!isEditing ? (
        <Dialog.Trigger className="inline-flex min-h-12 touch-manipulation items-center gap-2 bg-[#a7e5df] px-4 font-mono text-[10px] tracking-[0.15em] text-[#061413] uppercase transition-colors hover:bg-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061111] focus-visible:outline-none">
          <Plus aria-hidden="true" size={17} weight="bold" />
          New artwork
        </Dialog.Trigger>
      ) : null}

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#020606]/75 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-x-3 top-1/2 z-50 mx-auto flex max-h-[calc(100dvh-1.5rem)] w-auto max-w-5xl -translate-y-1/2 flex-col overflow-hidden border border-[#a7e5df]/45 bg-[#071413] text-[#effffd] shadow-[0_24px_100px_rgba(0,0,0,0.65)] outline-none sm:inset-x-6">
          <div className="flex items-start justify-between gap-5 border-b border-[#a7e5df]/25 px-5 py-4 sm:px-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#f4988f] uppercase">
                {isEditing
                  ? `Archive signal ${String(artwork?.archiveNumber).padStart(2, "0")}`
                  : "Archive intake"}
              </p>
              <Dialog.Title className="font-display mt-2 text-4xl leading-none tracking-[-0.055em] uppercase sm:text-5xl">
                {dialogTitle}
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-xl text-sm leading-relaxed text-[#d4e9e6]/75">
                Add images, then drag a frame or use the arrows to set the exact
                public carousel order.
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 gap-2">
              {artwork ? (
                <DeleteArtworkButton archiveNumber={artwork.archiveNumber} />
              ) : null}
              <Dialog.Close
                disabled={isSaving}
                aria-label={`Close ${dialogTitle.toLowerCase()} dialog`}
                className="flex size-11 touch-manipulation items-center justify-center border border-[#a7e5df]/35 text-[#a7e5df] transition-colors hover:bg-[#a7e5df] hover:text-[#061413] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-wait disabled:opacity-40"
              >
                <X aria-hidden="true" size={20} />
              </Dialog.Close>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="grid min-h-0 gap-6 overflow-y-auto px-5 py-5 sm:px-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
                Title
                <input
                  name="title"
                  maxLength={160}
                  defaultValue={artwork?.title}
                  className="min-h-12 border border-[#a7e5df]/35 bg-[#061111] px-3 font-sans text-sm tracking-normal text-[#effffd] outline-none placeholder:text-[#a7e5df]/35 focus:border-[#a7e5df] focus-visible:ring-2 focus-visible:ring-[#a7e5df]/45"
                  placeholder="Artwork title"
                />
              </label>
              <label className="grid gap-2 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase">
                Date
                <input
                  name="publishedAt"
                  type="date"
                  required
                  defaultValue={artwork?.publishedAt}
                  className="min-h-12 border border-[#a7e5df]/35 bg-[#061111] px-3 font-mono text-xs tracking-normal text-[#effffd] outline-none focus:border-[#a7e5df] focus-visible:ring-2 focus-visible:ring-[#a7e5df]/45"
                />
              </label>
            </div>

            <section
              aria-labelledby="artwork-images-heading"
              className="grid gap-4"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3
                    id="artwork-images-heading"
                    className="font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase"
                  >
                    Carousel images
                  </h3>
                  <p className="mt-1 text-sm text-[#d4e9e6]/70">
                    The first frame is the cover image. Add more images here,
                    then drag to reorder or use the arrows.
                  </p>
                </div>
                <p
                  aria-live="polite"
                  className="font-mono text-[10px] tracking-[0.12em] text-[#f4988f] uppercase"
                >
                  {images.length} / {MAX_IMAGE_COUNT} selected
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(event) => {
                  addImages(Array.from(event.currentTarget.files ?? []))
                  event.currentTarget.value = ""
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving || images.length >= MAX_IMAGE_COUNT}
                className="flex min-h-28 w-full touch-manipulation flex-col items-center justify-center gap-2 border border-dashed border-[#a7e5df]/45 bg-[#061111] px-4 text-[#a7e5df] transition-colors hover:border-[#a7e5df] hover:bg-[#a7e5df]/5 focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageSquare aria-hidden="true" size={26} weight="light" />
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
                  Add images
                </span>
              </button>

              {images.length ? (
                <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => {
                    const imageName = isPendingImage(image)
                      ? image.file.name
                      : `Carousel image ${index + 1}`
                    const imageUrl = isPendingImage(image)
                      ? image.previewUrl
                      : image.url

                    return (
                      <li
                        key={image.clientId}
                        draggable={!isSaving}
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => onDrop(event, index)}
                        onDragEnd={() => setDraggedIndex(null)}
                        className={`group relative overflow-hidden border bg-[#061111] transition-colors ${
                          draggedIndex === index
                            ? "border-[#f4988f] opacity-60"
                            : "border-[#a7e5df]/35"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1110]">
                          <img
                            src={imageUrl}
                            alt={`Preview of ${imageName}`}
                            className="size-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-[#050505]/90 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[#a7e5df] uppercase">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <ArrowsOutCardinal
                            aria-hidden="true"
                            size={17}
                            className="absolute top-2 right-2 text-[#effffd]/75"
                          />
                        </div>
                        <div className="flex items-center gap-1 border-t border-[#a7e5df]/20 p-2">
                          <p className="min-w-0 flex-1 truncate px-1 font-mono text-[9px] tracking-[0.06em] text-[#d4e9e6]/75">
                            {isPendingImage(image)
                              ? image.file.name
                              : `${image.width} × ${image.height}`}
                          </p>
                          <button
                            type="button"
                            aria-label={`Move ${imageName} earlier`}
                            title="Move earlier"
                            disabled={isSaving || index === 0}
                            onClick={() => repositionImage(index, index - 1)}
                            className="flex size-11 shrink-0 touch-manipulation items-center justify-center text-[#a7e5df] transition-colors hover:bg-[#a7e5df]/10 hover:text-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            <ArrowLeft aria-hidden="true" size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${imageName} later`}
                            title="Move later"
                            disabled={isSaving || index === images.length - 1}
                            onClick={() => repositionImage(index, index + 1)}
                            className="flex size-11 shrink-0 touch-manipulation items-center justify-center text-[#a7e5df] transition-colors hover:bg-[#a7e5df]/10 hover:text-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            <ArrowRight aria-hidden="true" size={18} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${imageName}`}
                            title="Remove image"
                            disabled={isSaving}
                            onClick={() => removeImage(image)}
                            className="flex size-11 shrink-0 touch-manipulation items-center justify-center text-[#ff9d98] transition-colors hover:bg-[#ff746d] hover:text-[#130706] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash aria-hidden="true" size={18} />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              ) : (
                <p className="border border-[#a7e5df]/20 px-4 py-6 text-center text-sm text-[#d4e9e6]/65">
                  Your selected images will appear here in carousel order.
                </p>
              )}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#a7e5df]/20 pt-5">
              <Dialog.Close
                disabled={isSaving}
                className="min-h-11 touch-manipulation px-3 font-mono text-[10px] tracking-[0.14em] text-[#a7e5df] uppercase transition-colors hover:text-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </Dialog.Close>
              <div className="flex flex-wrap items-center justify-end gap-4">
                {status ? (
                  <p
                    aria-live="polite"
                    className="max-w-md font-mono text-[10px] tracking-[0.06em] text-[#a7e5df]/75"
                  >
                    {status}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={isSaving || !images.length}
                  className="inline-flex min-h-12 touch-manipulation items-center gap-2 bg-[#a7e5df] px-4 font-mono text-[10px] tracking-[0.15em] text-[#061413] uppercase transition-colors hover:bg-[#effffd] focus-visible:ring-2 focus-visible:ring-[#a7e5df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061111] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FloppyDisk aria-hidden="true" size={17} weight="bold" />
                  {isSaving
                    ? "Saving"
                    : isEditing
                      ? "Save artwork"
                      : "Publish artwork"}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
