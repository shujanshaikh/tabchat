"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import Image from "next/image"
import { Calligraffitti } from "next/font/google"
import ImagePopup from "@/components/image-open" 

export const call = Calligraffitti({
  variable: "--font-kode-mono",
  subsets: ["latin"],
  weight: "400",
})

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<{ url: string; prompt: string } | null>(null)

  const generateImage = useMutation(api.images.generate.scheduleImageGeneration)
  const images = useQuery(api.image.getImages)

  const presets = [
    "A dreamy watercolor landscape, pastel colors, soft light",
    "Futuristic neon city at dusk, rain reflections, cyberpunk",
    "Studio portrait, Rembrandt lighting, 85mm lens, shallow depth",
    "Macro shot of dew drops on a leaf, high detail",
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 px-4 pb-4 md:px-6 md:pb-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div className="flex flex-col justify-center">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="min-h-40 w-full text-sm leading-relaxed resize-none rounded-xl border border-border shadow-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-foreground/50"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    if (!prompt.trim()) return
                    await generateImage({ prompt, imageWidth: 1024, imageHeight: 1024, numberOfImages: 1 })
                    setPrompt("")
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-foreground/50 hidden sm:block">⌘ + Enter</span>
                <Button
                  onClick={async () => {
                    if (!prompt.trim()) return
                    await generateImage({ prompt, imageWidth: 1024, imageHeight: 1024, numberOfImages: 1 })
                    setPrompt("")
                  }}
                  disabled={!prompt.trim()}
                  className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
                >
                  Create
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button
                  key={p}
                  variant="secondary"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setPrompt(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {images && images.some((img) => Boolean(img.url) && img.status === "generated") ? (
              <div className="max-h-[1000px] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images
                    .filter((img) => Boolean(img.url) && img.status === "generated")
                    .map((image) => (
                      <div
                        key={image._id}
                        className="group relative overflow-hidden rounded-lg border border-border aspect-square transition hover:shadow-md cursor-pointer"
                        onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                      >
                        <Image
                          src={image.url!}
                          alt={image.prompt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                          quality={90}
                          loading="lazy"
                          unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                          <p className="text-[11px] text-white/90 line-clamp-2">{image.prompt}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <Card className="border border-border rounded-xl w-full">
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <p className="text-muted-foreground text-lg">
                      Enter a prompt to generate your first image
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <ImagePopup
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          prompt={selectedImage.prompt}
        />
      )}
    </div>
  )
}
