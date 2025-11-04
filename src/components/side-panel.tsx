"use client"
import React, { useEffect, useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { MessageSquare, Plus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

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
    const pathname = usePathname();
    const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
    const { isAuthenticated } = useConvexAuth();
    const deleteThread = useMutation(api.thread.deleteThread);
    const handleDeleteThread = async (threadId: string) => {
        await deleteThread({ threadId });
    };
    const threads = useQuery(api.thread.listThreads, {
        paginationOpts: {
            endCursor: null,
            numItems: 50,
            cursor: null,
            id: undefined,
            maximumRowsRead: 50,
            maximumBytesRead: 1000000,
        },
    });
    
    const createThread = useMutation(api.thread.createNewThread);
    const [isCreatingThread, setIsCreatingThread] = useState(false);

    // Get active thread from URL hash
    useEffect(() => {
        const updateActiveThread = () => {
            if (typeof window !== "undefined") {
                const hash = window.location.hash.replace(/^#/, "");
                setActiveThreadId(hash || undefined);
            }
        };
        
        updateActiveThread();
        window.addEventListener("hashchange", updateActiveThread);
        return () => window.removeEventListener("hashchange", updateActiveThread);
    }, [pathname]);

    const handleThreadClick = (threadId: string) => {
        if (pathname === "/chat") {
            // If already on chat page, just update hash directly (this triggers hashchange event)
            window.location.hash = `#${threadId}`;
            setActiveThreadId(threadId);
        } else {
            // Otherwise navigate to chat page with hash
            router.push(`/chat#${threadId}`);
            setActiveThreadId(threadId);
        }
    };

    const handleNewChat = async () => {
        // Prevent multiple rapid clicks
        if (isCreatingThread || !isAuthenticated) return;
        
        setIsCreatingThread(true);
        try {
            const newThreadId = await createThread({
                title: "New thread",
            });
            if (pathname === "/chat") {
                // If already on chat page, just update hash directly (this triggers hashchange event)
                window.location.hash = `#${newThreadId}`;
                setActiveThreadId(newThreadId as string);
            } else {
                // Otherwise navigate to chat page with hash
                router.push(`/chat#${newThreadId}`);
                setActiveThreadId(newThreadId as string);
            }
        } finally {
            setIsCreatingThread(false);
        }
    };

    return (
        <Sidebar
            variant="inset"
            side="left"
            className="sp-sidebar overflow-hidden"
        >
            <SidebarRail />
            <SidebarHeader className="sp-header relative">
                
            <h1 className="text-lg sm:text-lg px-10 py-3 lg:text-xl xl:text-2xl font-bold tracking-tight leading-tight">
                <Link href="/">
                  <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    tab.chat
                  </span>
                </Link>
            </h1>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-sidebar rounded-bl-[2rem] border-l border-b border-border">
                    <div className="absolute top-3 right-3">
                        <SidebarThemeToggleWrapper />
                    </div>
                </div>
            </SidebarHeader>
  
        
            <SidebarContent className="sp-content px-2 py-2 overflow-hidden flex flex-col">
            <div className="flex items-center justify-end px-2 pb-2">
                <SidebarTrigger className="h-7 w-7 rounded-md hover:bg-muted transition-colors" />
            </div>
            <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuButton onClick={() => router.push("/generate")} className="rounded-md justify-center text-center bg-sidebar-accent/50 hover:bg-sidebar-accent" tooltip="Text to Image" data-active={pathname === "/generate"}>
                                <span>Generate Images</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton onClick={() => router.push("/gallery")} className="rounded-md justify-center text-center bg-sidebar-accent/50 hover:bg-sidebar-accent" tooltip="Image to Image" data-active={pathname === "/gallery"}>
                                <span>Gallery</span>
                            </SidebarMenuButton>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                <SidebarGroup className="flex-1 min-h-0 flex flex-col">
                    <div className="flex flex-col px-2 py-1.5 gap-2 pb-4">
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                            Threads
                        </SidebarGroupLabel>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleNewChat}
                            disabled={isCreatingThread || !isAuthenticated}
                            className="h-7 rounded-md w-full justify-center"
                            title={isAuthenticated ? "New Thread" : "Sign in to create a new thread"}
                        >
                            {isCreatingThread ? (
                                <>
                                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                    <span>New Thread</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-3 w-3 mr-1.5" />
                                    <span>New Thread</span>
                                </>
                            )}
                        </Button>
                    </div>
                    <SidebarGroupContent className="flex-1 min-h-0 overflow-hidden">
                        <ScrollArea className="h-full">
                            {threads === undefined ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : threads?.page.length === 0 ? (
                                <div className="px-2 py-4 text-center">
                                    <p className="text-sm text-muted-foreground">No threads yet</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleNewChat}
                                        disabled={isCreatingThread || !isAuthenticated}
                                        className="mt-2"
                                    >
                                        {isCreatingThread ? (
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Plus className="h-3 w-3 mr-1" />
                                        )}
                                        New Chat
                                    </Button>
                                </div>
                            ) : (
                                <SidebarMenu className="space-y-1">
                                    {threads.page.map((thread) => {
                                        const isActive = activeThreadId === thread._id;
                                        const displayText = thread.title || "Untitled Chat";
                                        return (
                                            <SidebarMenuItem key={thread._id}>
                                                <SidebarMenuButton
                                                    onClick={() => handleThreadClick(thread._id)}
                                                    className={cn(
                                                        "rounded-md justify-start h-auto py-2 px-3 group/item relative",
                                                        isActive && "bg-primary/10 text-primary font-medium"
                                                    )}
                                                    tooltip={displayText}
                                                >
                                                    {!isActive && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteThread(thread._id);
                                                            }}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center w-5 h-5 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer z-10"
                                                            title="Delete thread"
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteThread(thread._id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </div>
                                                    )}
                                                    <MessageSquare className={cn(
                                                        "h-4 w-4 mr-2 flex-shrink-0 transition-all",
                                                        !isActive && "ml-0 group-hover/item:ml-6"
                                                    )} />
                                                    <span className="truncate text-sm flex-1 text-left">
                                                        {displayText}
                                                    </span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            )}
                        </ScrollArea>
                    </SidebarGroupContent>
                </SidebarGroup>
               
            </SidebarContent>
            <SidebarFooter>
                    <Button onClick={() => router.push("/setting")} className="rounded-md" variant="outline" data-active={pathname === "/setting"}>
                        <span>Settings</span>
                    </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
