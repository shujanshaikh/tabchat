"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const generateImage = useAction(api.images.generate.generate)


  const handleGenerateImage = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      console.log("Starting image generation...")
      const result = await generateImage({ prompt })
      console.log("Generation result:", result)
      
      if (result) {
        const dataUrl = `data:image/png;base64,${result}`
        console.log("Setting image data URL")
        setGeneratedImage(dataUrl)
      } else {
        console.log("No image generated - result was null/undefined")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      setGeneratedImage(null)
    } finally {
      console.log("Generation process completed")
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-foreground">
                imageflow
              </span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          <div className="flex flex-col justify-center">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="min-h-48 w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 resize-none text-sm leading-relaxed placeholder:text-zinc-400 border-zinc-200 dark:border-zinc-800 focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all duration-200 rounded-2xl shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleGenerateImage()
                  }
                }}
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-zinc-400 hidden sm:block">⌘ + Enter</span>
                <Button
                  onClick={handleGenerateImage}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {generatedImage ? (
              <Card className="p-4 bg-card/50 backdrop-blur-sm border border-white/10 rounded-4xl w-full">
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <Image
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </div>
              </Card>
            ) : (
              <Card className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl w-full">
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                   
                    <p className="text-muted-foreground text-lg">Enter a prompt to generate your first image</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
