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
} from "@/components/ui/sidebar"
import { Croissant_One } from 'next/font/google';

export const kodeMono = Croissant_One({
    variable: "--font-kode-mono",
    subsets: ["latin"],
    weight: "400",
});


export function Sidepanel() {
    return (
        <Sidebar
            variant="inset"
            side="left"
            className="sp-sidebar"
        >
            <SidebarRail />
            <SidebarHeader className="sp-header">
                <div className="flex items-center justify-between px-4 py-3">


                    <div className={`sp-title text-9xl font-semibold tracking-tight ${kodeMono.className}`}>picflow</div>


                    <SidebarTrigger className="h-8 w-8 hover:bg-sidebar-accent/50 transition-colors rounded-lg" />
                </div>
            </SidebarHeader>

            <SidebarContent className="sp-content px-2 py-2">
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5 px-2 rounded-xl">
                            <SidebarMenuButton className="rounded-xl" tooltip="Text to Image" data-active="true">

                                <span className="sp-label">Text to Image</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton className="rounded-xl" tooltip="Image to Image">
                                <span className="sp-label">Image to Image</span>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />
            </SidebarContent>
        </Sidebar>
    )
}