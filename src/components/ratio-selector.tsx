"use client"

import * as React from "react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command"
import { CheckIcon, ChevronDownIcon } from "@/components/icons"

type RatioItem = { id: string; name: string; ratio: string; width: number; height: number; description: string }

export function RatioSelector({
    selectedRatio,
    setSelectedRatio,
    imageRatios,
}: {
    selectedRatio: string
    setSelectedRatio: (value: string) => void
    imageRatios: RatioItem[]
}) {
    const [open, setOpen] = React.useState(false)

    const currentRatio = React.useMemo<RatioItem>(() => {
        return imageRatios.find((r) => r.id === selectedRatio) || imageRatios[0]
    }, [imageRatios, selectedRatio])

    const handleSelect = (value: string) => {
        setSelectedRatio(value)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 px-2 rounded-lg bg-card/90 border border-border/40 hover:bg-card/95 hover:border-border/60 transition-all duration-200 text-xs min-w-[180px] justify-between"
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <RatioPreview width={currentRatio.width} height={currentRatio.height} />
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="font-medium truncate">{currentRatio.name}</span>
                            <span className="text-muted-foreground text-xs shrink-0">({currentRatio.ratio})</span>
                        </div>
                    </div>
                    <ChevronDownIcon className="size-4 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-64" align="start">
                <Command>
                    <CommandInput placeholder="Search ratios…" />
                    <CommandList>
                        <CommandEmpty>No ratio found.</CommandEmpty>
                        <CommandGroup>
                            {imageRatios.map((ratio) => (
                                <CommandItem
                                    key={ratio.id}
                                    value={ratio.name}
                                    onSelect={() => handleSelect(ratio.id)}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <RatioPreview width={ratio.width} height={ratio.height} selected={selectedRatio === ratio.id} />
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-sm font-medium truncate">{ratio.name}</span>
                                                <span className="text-[11px] text-muted-foreground shrink-0">{ratio.ratio}</span>
                                                <span className="text-[11px] text-muted-foreground shrink-0">{ratio.width}×{ratio.height}</span>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground truncate">{ratio.description}</span>
                                        </div>
                                        <CheckIcon
                                            className={`ml-auto size-4 ${selectedRatio === ratio.id ? "opacity-100" : "opacity-0"}`}
                                        />
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function RatioPreview({ width, height, selected = false }: { width: number; height: number; selected?: boolean }) {
    const max = 22
    const aspect = height / width
    const w = aspect <= 1 ? max : Math.max(10, Math.round(max / aspect))
    const h = aspect <= 1 ? Math.max(10, Math.round(max * aspect)) : max

    return (
        <div className={`flex items-center justify-center size-7 rounded-md border ${selected ? "border-primary/70 bg-primary/5" : "border-border/70 bg-muted/20"}`}>
            <div
                className={`rounded-[3px] ${selected ? "bg-primary/60" : "bg-foreground/50"}`}
                style={{ width: w, height: h }}
            />
        </div>
    )
}