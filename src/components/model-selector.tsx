"use client"

import { models } from "../../convex/model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

export default function ModelSelector({
  model,
  setModel,
}: {
  model: string
  setModel: (model: string) => void
}) {
  const selectedModel = models.find((m) => m.id === model)

  return (
    <TooltipProvider>
      <Select
        value={model}
        onValueChange={(value) => setModel(value)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className=" rounded-xl">
              {selectedModel ? (
                <div className="flex items-center justify-between w-full p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sidebar-primary/80 shadow-sm" />
                    <span className="font-medium text-sm">{selectedModel.name}</span>
                  </div>
                </div>
              ) : (
                <SelectValue placeholder="Select Model" />
              )}
            </SelectTrigger>
          </TooltipTrigger>

          {selectedModel && (
            <TooltipContent
              side="top"
              className="bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 text-sidebar-foreground shadow-lg max-w-xs p-4"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-sidebar-foreground">
                  {selectedModel.name}
                </h4>
                <p className="text-xs text-sidebar-foreground/80 leading-relaxed">
                  {selectedModel.description}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>

        <SelectContent className="bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 rounded-lg w-80 shadow-2xl p-2">
          {models.map((modelItem) => (
            <SelectItem
              key={modelItem.id}
              value={modelItem.id}
              className="w-full p-0 hover:bg-sidebar-accent/30 focus:bg-sidebar-accent/30 transition-colors"
            >
              <div className="flex flex-col items-start text-left w-full border border-sidebar-border/40 rounded-md p-4 hover:border-sidebar-border/70 transition-colors">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      model === modelItem.id
                        ? "bg-sidebar-primary shadow-sm shadow-sidebar-primary/30"
                        : "bg-sidebar-border"
                    }`} />
                    <span className="font-semibold text-sm text-sidebar-foreground">
                      {modelItem.name}
                    </span>
                  </div>
                </div>
                <p className="text-sidebar-foreground/70 text-xs leading-relaxed">
                  {modelItem.description}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TooltipProvider>
  )
}
