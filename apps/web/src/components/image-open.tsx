"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "@/components/icons"

interface ImagePopupProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export default function ImagePopup({ isOpen, onClose, imageUrl, prompt }: ImagePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full mx-4 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/20">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Generated Image
          </DialogTitle>
         
        </div>

        <div className="p-6 space-y-6">

          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted/30 border border-border/30">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={prompt}
              fill
              className="object-contain"
              quality={95}
              unoptimized
            />
          </div>

          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Prompt
              </h3>
            </div>
            <div className="bg-muted/30 border border-border/20 rounded-lg p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {prompt}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Click outside or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Esc</kbd> to close
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = "generated-image.png"
                link.click()
              }}
              className="gap-2 border-border/40 hover:border-border/60"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
