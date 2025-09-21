"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"




export function RatioSelector({
    selectedRatio,
    setSelectedRatio,
    imageRatios,
}: {
    selectedRatio: string
    setSelectedRatio: (value: string) => void
    imageRatios: { id: string; name: string; ratio: string; width: number; height: number; description: string }[]
}) {
    const getCurrentRatio = () => {
        return imageRatios.find((ratio) => ratio.id === selectedRatio) || imageRatios[0]
      }
    const currentRatio = getCurrentRatio()

    return (
      <TooltipProvider>
        <Select
          value={selectedRatio}
          onValueChange={(value) => setSelectedRatio(value)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="h-10 px-4 rounded-xl bg-card/95 border border-border/30 hover:bg-card/98 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/80 shadow-sm" />
                  <span className="font-medium text-sm">{currentRatio.name}</span>
                  <span className="text-xs text-muted-foreground">({currentRatio.ratio})</span>
                </div>
              </SelectTrigger>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg max-w-xs p-4"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  {currentRatio.name} ({currentRatio.ratio})
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentRatio.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentRatio.width} × {currentRatio.height} pixels
                </p>
              </div>
            </TooltipContent>
          </Tooltip>

          <SelectContent className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg w-80 shadow-2xl p-2">
            {imageRatios.map((ratio) => (
              <SelectItem
                key={ratio.id}
                value={ratio.id}
                className="w-full p-0 hover:bg-accent/30 focus:bg-accent/30 transition-colors"
              >
                <div className="flex flex-col items-start text-left w-full border border-border/40 rounded-md p-4 hover:border-border/70 transition-colors">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedRatio === ratio.id
                          ? "bg-primary shadow-sm shadow-primary/30"
                          : "bg-border"
                      }`} />
                      <span className="font-semibold text-sm">
                        {ratio.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({ratio.ratio})
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                    {ratio.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ratio.width} × {ratio.height} pixels
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TooltipProvider>
    )
  }