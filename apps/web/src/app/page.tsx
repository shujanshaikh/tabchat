"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import UserProfile from "@/components/user-profile";

const CircularGallery = dynamic(() => import("@/components/CircularGallery"), { ssr: true });
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {


  return (
    <div className="relative min-h-screen">

      <div className="pointer-events-none absolute inset-0 -z-10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.muted.DEFAULT)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14] dark:opacity-[0.07]" />

        <div className="absolute -top-56 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl bg-primary/15 dark:bg-primary/10" />
        <div className="absolute -bottom-48 left-6 h-[28rem] w-[28rem] rounded-full blur-3xl bg-accent/10" />


        <div className="absolute inset-0 [mask-image:radial-gradient(transparent_0,black_55%,black)] bg-gradient-to-b from-background/0 via-background/0 to-background/60" />
      </div>


      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="size-6 rounded-full bg-gradient-to-tr from-primary/80 via-accent/70 to-foreground/80" />
          <span className="text-sm font-medium tracking-widest text-muted-foreground">PICFLOW</span>
        </Link>
        <UserProfile />
      </div>


      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center space-y-10 lg:space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9]">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Create images, your way.
                </span>
              </h1>
              <p className="text-balance text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Generate, edit, and upscale across the latest FAL models with a calm, minimalist studio designed for focus.
              </p>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button asChild variant="secondary" size="lg" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium rounded-full shadow-sm hover:shadow-md transition-shadow">
                <Link href="/generate" className="flex items-center">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium rounded-full">
                <Link href="/dashboard">View Gallery</Link>
              </Button>
            </div>


            <div className="mt-14 lg:mt-20">
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm text-muted-foreground">Drag or scroll to explore</p>
              </div>

              <div className="relative mx-auto max-w-5xl rounded-3xl border bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
                <div className="h-[420px] sm:h-[520px] lg:h-[600px]">
                  <CircularGallery
                    items={[
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/87a30c3d-0022-43be-a5bc-ba8b9009d4bd', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/133cadb2-abd4-4deb-b911-c8d94e161aa3', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/2eb8c85d-3f80-4beb-bdcb-1285c7485112', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/daee1474-ba74-4ff2-8158-c9e12d5a5b0a', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/c5e742d7-3b97-4046-8f3d-da6e3491f903', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/049d0b23-2904-46a4-8466-82cb31fb0e6e', text: '' },
                    ]}
                    bend={3}
                    borderRadius={0.06}
                    textColor="#e5e7eb"
                    font="bold 28px Figtree"
                    scrollSpeed={2}
                    scrollEase={0.06}
                  />
                </div>
              </div>
            </div>


            <div className="pt-8">
              <p className="text-xs text-muted-foreground/80">No clutter. No noise. Just creation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}