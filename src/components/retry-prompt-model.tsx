"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RefreshCcw, Check } from "lucide-react";
import { chatModel } from "../../convex/chatModel";
import { cn } from "@/lib/utils";
import { useStoreValue } from "@simplestack/store/react";
import { selectedModel, urls } from "@/lib/store";

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  xai: "xAI",
  zai: "Zai",
  deepseek: "DeepSeek",
  perplexity: "Perplexity",
  moonshotai: "Moonshot AI",
};

function getProvider(id: string) {
  const provider = id.split("/")[0] || "other";
  return provider in PROVIDER_LABELS ? provider : "other";
}

export default function RetryPromptModel({ visibleText, threadId, sendMessage  }: { visibleText: string, threadId: string, sendMessage: (args: { threadId: string, prompt: string, model: string, urls: string[] }) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const selectedModelValue = useStoreValue(selectedModel);
  const urlsValue = useStoreValue(urls);
  const [tempModel, setTempModel] = useState(selectedModelValue);

  useEffect(() => {
    setTempModel(selectedModelValue);
  }, [selectedModelValue]);

  const groupedModels = useMemo(() => {
    const groups = chatModel.reduce<Record<string, typeof chatModel>>((acc, m) => {
      const provider = getProvider(m.id);
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(m);
      return acc;
    }, {});

    const providersOrder = chatModel
      .map((m) => getProvider(m.id))
      .filter((p, idx, arr) => arr.indexOf(p) === idx);

    return { groups, providersOrder };
  }, []);

  const handleModelSelect = (model: string) => {
    const text = visibleText?.trim();
    if (!text) return;
    
    setTempModel(model);
    
    void sendMessage({
      threadId: threadId,
      prompt: text,
      model: model,
      urls: urlsValue.length > 0 ? urlsValue : [],
    });
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 rounded-md"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] p-0 rounded-xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 shadow-xl shadow-black/5 backdrop-blur-sm"
        side="bottom"
        align="start"
        sideOffset={6}
      >
        <div className="flex flex-col overflow-hidden rounded-xl">
          <div className="px-3 py-2.5 border-b border-border/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
            <div className="flex items-center">
              <h3 className="text-xs font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Retry
              </h3>
              <RefreshCcw className="h-3.5 w-3.5 ml-1" />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {groupedModels.providersOrder.map((provider) => (
              <div key={provider} className="mb-2 last:mb-0">
                <div className="px-1.5 py-1 mb-0.5">
                  <span className="text-[9px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                    {PROVIDER_LABELS[provider] || provider}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {groupedModels.groups[provider]?.map((modelOption) => {
                    const isSelected = tempModel === modelOption.id;
                    return (
                      <button
                        key={modelOption.id}
                        onClick={() => handleModelSelect(modelOption.id)}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-md text-xs transition-all duration-200",
                          "flex items-center justify-between",
                          "hover:bg-gradient-to-r hover:from-accent/50 hover:via-accent/30 hover:to-transparent hover:text-accent-foreground hover:shadow-sm",
                          "focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
                          isSelected && "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/5 text-primary font-medium ring-1 ring-primary/40 shadow-sm shadow-primary/10"
                        )}
                      >
                        <span className="truncate">{modelOption.name}</span>
                        {isSelected && (
                          <Check className="h-3 w-3 text-primary ml-1.5 flex-shrink-0 drop-shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}