"use client"
import { useMutation } from "convex/react";
import { useStoreValue } from "@simplestack/store/react";
import { api } from "../../convex/_generated/api";
import {
  optimisticallySendMessage,
  useSmoothText,
  type UIMessage,
} from "@convex-dev/agent/react";
import { forThreadId, hoverThreadId } from "@/lib/store";
import { Message, MessageContent } from "./ai-elements/message";
import { cn } from "@/lib/utils";
import { Response } from "./ai-elements/response";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { GitBranch } from "lucide-react";
import { ToolUIPart } from "ai";
import Image from "next/image";
import RetryPromptModel from "./retry-prompt-model";
import { WebSearchParts } from "./web-search-parts";
import { Source, Sources, SourcesContent, SourcesTrigger } from "./ai-elements/sources";
import ReasoningParts, { TextParts } from "./reasoning-part";
import LoadingDots from "./loading-dots";

export default function ChatMessage({ message, threadId, webSearch }: { message: UIMessage, threadId: string, webSearch: boolean }) {
    const isUser = message.role === "user";
    const isStreaming = message.status === "streaming";
    const isFailed = message.status === "failed";
    const [visibleText] = useSmoothText(message.text, {
      startStreaming: isStreaming,
    });
    const forkThread = useMutation(api.thread.forkThread);
    const forThreadIdValue = useStoreValue(forThreadId);
  
    const hoverThreadIdValue = useStoreValue(hoverThreadId);
  
    const handleForkThread = async (threadId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (forThreadIdValue) return;
  
      forThreadId.set(threadId);
      try {
        const newThreadId = await forkThread({ threadId });
        window.location.hash = `#${newThreadId}`;
      } catch (error) {
        console.error("Failed to fork thread:", error);
      } finally {
        forThreadId.set("");
      }
    };
  
    const sourceParts = message.parts.filter((p) => p.type === "source-url");
    const hasSources = sourceParts.length > 0;
  
    const reasoningParts = message.parts.filter((p) => p.type === "reasoning");
  
    const textParts = message.parts.filter((p) => p.type === "text");
    const webSearchParts = message.parts.filter(
      (p): p is ToolUIPart => p.type === "tool-webSearch",
    );
  
  
    const sendMessage = useMutation(
      api.chatStreaming.initiateAsyncStreaming,
    ).withOptimisticUpdate(
      optimisticallySendMessage(api.chatStreaming.listThreadMessages),
    );
  
    const handleRetry = async (args: { threadId: string, prompt: string, model: string, urls: string[] }): Promise<void> => {
      await sendMessage({
        threadId: args.threadId,
        prompt: args.prompt,
        model: args.model,
        urls: args.urls.length > 0 ? args.urls : undefined,
        webSearch: webSearch,
      });
    };
    if (isUser) {
      return (
        <div 
          className="flex flex-col items-end group"
          onMouseEnter={() => hoverThreadId.set(true)}
          onMouseLeave={() => hoverThreadId.set(false)}
        >
          <Message from="user">
            <MessageContent
              variant="contained"
              className={cn(
                "rounded-2xl shadow-sm",
                isFailed && "bg-destructive/10 border-destructive/20 text-destructive"
              )}
            >
              {visibleText && <Response>{visibleText}</Response>}
              {message.parts
                .filter((part) => part.type === "file" && (part as any).mediaType?.startsWith("image/"))
                .length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.parts
                      .filter((part) => part.type === "file" && (part as any).mediaType?.startsWith("image/"))
                      .map((part, idx) => (
                        <div
                          key={`user-message-image-${idx}`}
                          className="relative group rounded-xl overflow-hidden border border-border/40 bg-muted/30 hover:border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Image
                            width={200}
                            height={200}
                            src={(part as any).url}
                            className="max-w-[280px] max-h-[280px] min-w-[120px] min-h-[120px] w-auto h-auto object-cover"
                            alt="Uploaded image"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        </div>
                      ))}
                  </div>
                )}
            </MessageContent>
          </Message>
          {!isStreaming && (
            <div 
              className={cn(
                "mt-2 flex items-center justify-end gap-2 transition-opacity duration-200 ease-in-out",
                hoverThreadIdValue 
                  ? "opacity-100 pointer-events-auto" 
                  : "opacity-0 pointer-events-none"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <RetryPromptModel visibleText={visibleText || ""} threadId={threadId} sendMessage={handleRetry} />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  className="bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground shadow-lg px-3 py-2 text-xs font-medium"
                >
                  Retry with different model
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => {
                    navigator.clipboard.writeText(visibleText || "");
                  }}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top"
                  className="bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground shadow-lg px-3 py-2 text-xs font-medium"
                >
                  Copy
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      );
    }
  
    return (
      <>
        <Message from="assistant">
          <MessageContent
            variant="flat"
            className={cn(
              "w-full",
              isFailed && "bg-destructive/10 border-destructive/20 text-destructive rounded-2xl px-4 py-3"
            )}
          >
  
            {hasSources && (
              <Sources className="mb-4">
                <SourcesTrigger count={sourceParts.length} />
                {sourceParts.map((part, i) => (
                  <SourcesContent key={`${message.key}-source-${i}`}>
                    <Source href={part.url || ""} title={part.url || ""} />
                  </SourcesContent>
                ))}
              </Sources>
            )}
  
            {webSearchParts.length > 0 && (
              <WebSearchParts
                parts={webSearchParts}
                messageKey={message.key}
              />
            )}
  
            {reasoningParts.length > 0 && (
              <ReasoningParts
                parts={reasoningParts}
                messageKey={message.key}
                isStreaming={isStreaming}
              />
            )}
  
            {textParts.length > 0 && (
              <TextParts
                parts={textParts}
                messageKey={message.key}
                isStreaming={isStreaming}
              />
            )}
  
            {message.parts.length === 0 && (
              <div className="leading-relaxed text-base text-foreground/90">
                {visibleText ? (
                  <Response>{visibleText}</Response>
                ) : isStreaming ? (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <LoadingDots />
                  </span>
                ) : null}
              </div>
            )}
          </MessageContent>
        </Message>
        {!isStreaming && message.parts.length > 0 && (
          <div className="mt-3 flex items-center justify-start gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <RetryPromptModel visibleText={visibleText || ""} threadId={threadId} sendMessage={handleRetry} />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="top"
                className="bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground shadow-lg px-3 py-2 text-xs font-medium"
              >
                Retry with different model
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => {
                  navigator.clipboard.writeText(visibleText || "");
                }}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="top"
                className="bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground shadow-lg px-3 py-2 text-xs font-medium"
              >
                Copy
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => {
                  handleForkThread(threadId);
                }}>
                  <GitBranch className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="top"
                className="bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground shadow-lg px-3 py-2 text-xs font-medium"
              >
                Fork thread
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </>
    );
  }