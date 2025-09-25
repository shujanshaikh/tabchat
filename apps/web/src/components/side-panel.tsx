"use client"
import React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation";

function SidebarThemeToggleWrapper() {
    const { state, setOpen, isMobile, setOpenMobile } = useSidebar()
    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(true)
        } else if (state === "collapsed") {
            setOpen(true)
        }
    }
    return (
        <div onClick={handleClick}>
            <ModeToggle />
        </div>
    )
}

export function Sidepanel() {
    const router = useRouter();
    return (
        <Sidebar
            variant="inset"
            side="left"
            className="sp-sidebar overflow-hidden"
        >
            <SidebarRail />
            <SidebarHeader className="sp-header relative">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="text-2xl font-bold">picflow</div>
                    <SidebarTrigger className="h-6 w-6 rounded-md hover:bg-muted transition-colors" />
                </div>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-sidebar rounded-bl-[2rem] border-l border-b border-border">
                    <div className="absolute top-3 right-3">
                        <SidebarThemeToggleWrapper />
                    </div>
                </div>
            </SidebarHeader>

        
            <SidebarContent className="sp-content px-2 py-2 overflow-hidden">
            <div className="flex items-center justify-end px-2 pb-2">
                <SidebarTrigger className="h-7 w-7 rounded-md hover:bg-muted transition-colors" />
            </div>
            <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuButton onClick={() => router.push("/text-to-image")} className="rounded-md" tooltip="Text to Image" data-active="true">
                                <span>Text to Image</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton onClick={() => router.push("/image-to-image")} className="rounded-md" tooltip="Image to Image">
                                <span>Image to Image</span>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
