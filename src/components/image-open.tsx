"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image"

interface ImagePopupProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export default function ImagePopup({ isOpen, onClose, imageUrl, prompt }: ImagePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-4xl">
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
        </VisuallyHidden>

        <div className="relative w-full h-[60vh] bg-zinc-900/50 rounded-4xl">
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        <div className="p-4 bg-transparent">
          <p className="text-sm text-muted-foreground">{prompt}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
