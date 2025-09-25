"use client"

import React from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function SidebarFloatingTrigger() {
  const { open, openMobile, isMobile } = useSidebar()

  const shouldShow = (isMobile && !openMobile) || (!isMobile && !open)

  if (!shouldShow) return null

  return (
    <div
      className="fixed left-4 top-4 z-50"
      aria-hidden={false}
    >
      <SidebarTrigger
        className="h-6 w-6 rounded-md hover:bg-muted transition-colors"
      />
    </div>
  )
}

export default SidebarFloatingTrigger


