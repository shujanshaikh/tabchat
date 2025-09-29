"use client"

import Image from "next/image"
import Link from "next/link"
import { Settings, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"


function UserAvatar({
    name,
    imageUrl,
    size = 36,
}: {
    name?: string | null
    imageUrl?: string | null
    size?: number
}) {
    const initial = (name?.trim()?.[0] || "U").toUpperCase()
    const sizeClass = size >= 40 ? "text-sm" : "text-xs"
    
    return (
        <div
            className="relative inline-flex items-center justify-center overflow-hidden rounded-full
                 border border-border/50 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 
                 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300
                 hover:scale-105 hover:border-primary/30"
            style={{ width: size, height: size }}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl || "/placeholder.svg?height=36&width=36&query=user%20avatar"}
                    alt={name ?? "User"}
                    width={size}
                    height={size}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className={`${sizeClass} font-semibold text-primary-foreground`}>
                    {initial}
                </span>
            )}
            

            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-full" />
        </div>
    )
}

export default function UserProfile() {
    const { data: session } = authClient.useSession()
    const user = session?.user
    if (!user) return null

    const imageUrl = (user as { image?: string | null } | undefined)?.image ?? undefined
    const name = user.name ?? "User"
    const email = (user as { email?: string | null } | undefined)?.email ?? null

    async function handleSignOut() {
        try {
            await authClient.signOut()
        } catch (err) {
            console.log("sign out error", err)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Open user menu"
                    className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 hover:scale-105"
                >
                    <UserAvatar name={name} imageUrl={imageUrl} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary/80 rounded-full border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align="end" 
                className="w-72 p-0 overflow-hidden bg-popover/95 backdrop-blur-xl border border-border/50 shadow-xl"
                sideOffset={8}
            >
                <div className="relative p-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/30">
                    <div className="flex items-center gap-3">
                        <UserAvatar name={name} imageUrl={imageUrl} size={44} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                            {email ? (
                                <p className="truncate text-xs text-muted-foreground mt-0.5">{email}</p>
                            ) : null}
                        </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl" />
                    <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-lg" />
                </div>

                <div className="p-2">
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Account
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem asChild className="cursor-pointer group">
                        <Link 
                            href="/settings" 
                            className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-accent/50 transition-colors duration-200"
                        >
                            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm">Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-border/30" />

                <div className="p-2">
                    <DropdownMenuItem
                        className="cursor-pointer group text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors duration-200"
                        onSelect={() => {
                            void handleSignOut()
                        }}
                    >
                        <div className="flex items-center gap-3 px-2 py-2.5 rounded-md">
                            <LogOut className="w-4 h-4 text-destructive" />
                            <span className="text-sm">Sign out</span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}