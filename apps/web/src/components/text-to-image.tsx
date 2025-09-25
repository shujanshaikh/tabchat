"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { api } from "@imageflow/convex/_generated/api"
import Image from "next/image"
import ImagePopup from "@/components/image-open"
import ModelSelector from "@/components/model-selector"
import { models } from "@imageflow/convex/model"
import { RatioSelector } from "./ratio-selector"
import ImageUploader from "@/components/image-uploader"
import { imageRatios } from "@/utils/image-ratio"




export default function ImageStudio({ images }: { images: Preloaded<typeof api.image.getImages> }) {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<{ url: string; prompt: string } | null>(null)
  const [url, setUrl] = useState("")

  const generateImage = useMutation(api.images.generate.scheduleImageGeneration)
  const imagesData = usePreloadedQuery(images);


  const presets = [
    "A pastel orange wall with an arched door and a vintage blue car parked in front, creating a charming retro aesthetic.",
    "Moody portrait of a person in motion, with dramatic lighting highlighting their hair and white t-shirt against a dark background.",
    "Artistic portrait of a young woman with colorful lighting and bokeh effects, creating a dreamy and ethereal atmosphere"
  ]

  const [model, setModel] = useState(models[0].id)



  const [selectedRatio, setSelectedRatio] = useState(imageRatios[3].id)

  const getCurrentRatio = () => {
    return imageRatios.find((ratio) => ratio.id === selectedRatio) || imageRatios[3]
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    const currentRatio = getCurrentRatio()
    await generateImage({
      prompt,
      imageWidth: currentRatio.width,
      imageHeight: currentRatio.height,
      numberOfImages: 1,
      model: model,
      url: url ?? ""
    })
    setPrompt("")
  }

  return (
    <div className="h-full relative text-foreground">
      <div className="relative max-w-6xl mx-auto px-6 py-14 z-10">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Generate Your Unique Digital Art
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your dream, and we&apos;ll <span className="font-semibold">bring it to life</span>.
          </p>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2">
              <div className="relative group p-4 -m-4">
                <div className="absolute inset-0 bg-gradient-to-r from-card/10 via-card/20 to-card/10 backdrop-blur-2xl rounded-t-3xl -z-10 opacity-60 transition-all duration-700"></div>
                <div className="absolute inset-1 bg-card/5 backdrop-blur-xl rounded-2xl -z-10 opacity-0 transition-all duration-500"></div>
                <div className="pointer-events-none absolute -inset-4 rounded-[28px] bg-gradient-to-r from-primary/30 via-primary/10 to-transparent blur-3xl -z-20 opacity-40 transition-opacity duration-700"></div>

                <div className="relative">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Write your prompt here... (e.g. A neon city with flying cars)"
                    className="w-full rounded-t-3xl bg-card border-0
                    text-base leading-relaxed placeholder-muted-foreground text-foreground p-4 pr-44 pb-20 min-h-[160px] max-h-[60vh] resize-y
                    focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
                    transition-all duration-300
                    shadow-inner relative z-10"
                  />

                  <div className="pointer-events-none absolute bottom-4 right-4 z-20">
                    <div className="flex items-center gap-3 pointer-events-auto whitespace-nowrap">
                      <RatioSelector
                        selectedRatio={selectedRatio}
                        setSelectedRatio={setSelectedRatio}
                        imageRatios={imageRatios}
                      />
                      <ModelSelector model={model} setModel={setModel} />
                      <ImageUploader value={url} onChange={setUrl} size={40} />

                      <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80
                        text-primary-foreground font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg hover:shadow-xl focus:shadow-xl hover:scale-[1.02] focus:scale-[1.02]
                        border border-primary/20 hover:border-primary/30 backdrop-blur-sm overflow-hidden"
                        aria-label="Generate image"
                      >

                        <div className="relative z-10 flex items-center gap-2">
                          <span>Generate</span>
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-card/30 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-lg">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Prompt Inspiration
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {presets.map((p, index) => (
                      <Button
                        key={p}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left rounded-xl border border-border/30 bg-background/50 text-foreground/80
                        hover:bg-accent hover:text-accent-foreground hover:border-primary/30 transition-all duration-200
                        px-3 py-2 h-auto whitespace-normal text-sm leading-relaxed group"
                        onClick={() => setPrompt(p)}
                      >
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium group-hover:bg-primary/20 transition-colors">
                            {index + 1}
                          </span>
                          <span className="flex-1">{p.split(",")[0]}...</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          {imagesData && Array.isArray(imagesData) && imagesData.some((img) => Boolean(img.url) && img.status === "generated") ? (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {imagesData
                .filter((img) => Boolean(img.url) && img.status === "generated")
                .map((image, idx: number) => (
                  <div
                    key={image._id}
                    className={`break-inside-avoid cursor-pointer animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                  >
                    <div className="relative group">
                      <Image
                        src={image.url! || "/placeholder.svg"}
                        alt={image.prompt}
                        width={300}
                        height={300}
                        className="w-full h-auto object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        quality={85}
                        loading="lazy"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            null
          )}
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
