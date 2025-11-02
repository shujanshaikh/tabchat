import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { chatModel } from "@imageflow/convex/chatModel";
import { cn } from "@/lib/utils";

export default function ChatModelSelector( { model, setModel }: { model: string, setModel: (model: string) => void } ) {
    const selectedModelData = chatModel.find((m) => m.id === model);
    
    return (
        <Select
            value={model}
            onValueChange={(value) => setModel(value)}
        >
            <SelectTrigger 
                size="sm"
                className={cn(
                    "h-7 px-2.5 text-xs font-medium bg-background/50 border-border/50 hover:bg-background/70 hover:border-border rounded-xl shadow-sm transition-all",
                    "focus:ring-1 focus:ring-ring/50 focus:ring-offset-0"
                )}
            >
                <SelectValue>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                        <span>{selectedModelData?.name || "Select Model"}</span>
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="min-w-[180px] rounded-xl">
                {chatModel.map((modelOption) => (
                    <SelectItem 
                        key={modelOption.id} 
                        value={modelOption.id}
                        className="text-sm py-2"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{modelOption.name}</span>
                            {modelOption.description && (
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                    {modelOption.description}
                                </span>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}   