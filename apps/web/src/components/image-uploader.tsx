"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { UploadButton } from "@/utils/uploadthing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PaperclipIcon, XIcon } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

type ImageUploaderProps = {
  value?: string
  onChange: (url: string) => void
  className?: string
  size?: number
}

export function ImageUploader({ value, onChange, className, size = 40 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)
  const [, setProgress] = useState(0)

  const handleClear = useCallback(() => {
    onChange("")
  }, [onChange])

  if (value) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl ring-1 ring-border/60 bg-card/30", className)} style={{ width: size, height: size }}>
        <Dialog>
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
            {isImageLoading && (
              <div className="absolute inset-0 animate-pulse bg-muted/60" />
            )}
            <Image
              src={value}
              alt="Uploaded image preview"
              fill
              className={cn("object-cover transition-transform duration-300", isImageLoading ? "scale-105" : "hover:scale-[1.02]")}
              sizes="(max-width: 768px) 100vw, 300px"
              unoptimized
              onLoadingComplete={() => setIsImageLoading(false)}
              onError={() => setIsImageError(true)}
            />
            {isImageError && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Preview unavailable</div>
            )}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />

            <DialogTrigger asChild>
              <button className="absolute inset-0 cursor-zoom-in" aria-label="View image" />
            </DialogTrigger>

            <div className="absolute top-1 right-1 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <UploadButton
                      endpoint="imageUploader"
                      disabled={isUploading}
                      onUploadBegin={() => setIsUploading(true)}
                      onUploadProgress={(p) => {
                        setProgress(p)
                        if (!isUploading) setIsUploading(true)
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false)
                        setTimeout(() => setProgress(0), 300)
                        if (res && res.length > 0) onChange(res[0].ufsUrl)
                      }}
                      onUploadError={() => { setIsUploading(false); setProgress(0) }}
                      content={{
                        allowedContent: "hidden",
                        button: () => (
                         
                            isUploading ? (
                              <svg className="h-3.5 w-3.5 animate-spin text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <PaperclipIcon className="h-3.5 w-3.5" />
                            )
                       
                            ),
                        // label: "",
                      }}
                      appearance={{
                        container: "ut-inline-block [&_[data-ut-element=button]]:ut-relative [&_[data-ut-element=button]]:ut-z-10",
                        button: "ut-h-6 ut-w-6 ut-rounded-xl ut-bg-white/5 ut-text-white/80 ut-ring-1 ut-ring-white/10 ut-transition-all ut-duration-200 hover:ut-bg-white/10 hover:ut-text-white ut-flex ut-items-center ut-justify-center ut-border-none focus:ut-outline-none",
                        allowedContent: "hidden",
                      }}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Replace</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-background/80 border border-border/60 hover:bg-background"
                    onClick={handleClear}
                    aria-label="Remove image"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden" showCloseButton>
            <div className="relative w-full h-[70vh] bg-black/5">
              <Image src={value} alt="Full preview" fill className="object-contain" sizes="100vw" unoptimized />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className={cn("", className)} style={{ width: size, height: size }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <UploadButton
              endpoint="imageUploader"
              disabled={isUploading}
              onUploadBegin={() => setIsUploading(true)}
              onUploadProgress={(p) => {
                setProgress(p)
                if (!isUploading) setIsUploading(true)
              }}
              onClientUploadComplete={(res) => {
                setIsUploading(false)
                setTimeout(() => setProgress(0), 300)
                if (res && res.length > 0) onChange(res[0].ufsUrl)
              }}
              onUploadError={() => { setIsUploading(false); setProgress(0) }}
              content={{
                allowedContent: "hidden",
                button: () => (
                  <span className="h-10 w-10 rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white flex items-center justify-center border-none focus:outline-none">
                    {isUploading ? (
                      <svg className="h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <PaperclipIcon className="h-5 w-5" />
                    )}
                  </span>
                ),
              }}
              appearance={{
                container: "ut-inline-block [&_[data-ut-element=button]]:ut-relative [&_[data-ut-element=button]]:ut-z-10",
                button: "ut-h-10 ut-w-10 ut-rounded-xl ut-bg-white/5 ut-text-white/80 ut-ring-1 ut-ring-white/10 ut-transition-all ut-duration-200 hover:ut-bg-white/10 hover:ut-text-white ut-flex ut-items-center ut-justify-center ut-border-none focus:ut-outline-none",
                allowedContent: "hidden",
              }}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>Attach image</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default ImageUploader


