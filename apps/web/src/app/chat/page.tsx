"use client"
import { useMutation, useAction } from "convex/react";
import { api } from "@imageflow/convex/_generated/api";
import {
  optimisticallySendMessage,
  useSmoothText,
  useUIMessages,
  type UIMessage,
} from "@convex-dev/agent/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, StopCircle } from "lucide-react";

import { ToolUIPart } from "ai";
import { useDemoThread } from "@/hooks/use-demo-thread";
import LoadingDots from "@/components/loading-dots";
import { chatModel } from "@imageflow/convex/chatModel";
import ChatModelSelector from "@/components/chat-model-selector";


export default function ChatStreaming() {
  const { threadId } = useDemoThread("New chat");

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {threadId ? (
          <Story threadId={threadId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Initializing chat...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Story({ threadId }: { threadId: string }) {
  // Loads the messages as UIMessages (where all tool calls and assistant
  // responses are parts in one message). See below for other options.



  const [selectedModel, setSelectedModel] = useState(chatModel[0].id);
  const {
    results: messages,
    status,
    loadMore,
  } = useUIMessages(
    api.chatStreaming.listThreadMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  );
  
  const sendMessage = useMutation(
    api.chatStreaming.initiateAsyncStreaming,
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.chatStreaming.listThreadMessages),
  );
  const abortStreamByOrder = useMutation(
    api.chatStreaming.abortStreamByOrder,
  );
  const updateThreadTitle = useAction(api.thread.updateThreadTitle);
  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleUpdatedRef = useRef(false);
  const isStreaming = messages.some((m) => m.status === "streaming");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset title update flag when threadId changes
  useEffect(() => {
    titleUpdatedRef.current = false;
  }, [threadId]);

  function onSendClicked() {
    if (prompt.trim() === "") return;
    const isFirstMessage = messages.length === 0;
    void sendMessage({ threadId, prompt, model: selectedModel }).catch(() => setPrompt(prompt));
    setPrompt("");
    
    // Update thread title after first message is sent
    if (isFirstMessage && !titleUpdatedRef.current) {
      titleUpdatedRef.current = true;
      // Wait a bit for the message to be saved before updating title
      setTimeout(() => {
        updateThreadTitle({ threadId }).catch(console.error);
      }, 1000);
    }
  }

  function handleAbort() {
    const order = messages.find((m) => m.status === "streaming")?.order ?? 0;
    void abortStreamByOrder({ threadId, order });
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 md:px-6 overflow-hidden">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-16 pb-6 space-y-3">
          <div className="max-w-[80%] mx-auto">
            {messages.length > 0 ? (
              <>
                {status === "CanLoadMore" && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadMore(4)}
                      className="text-muted-foreground"
                    >
                      Load more messages
                    </Button>
                  </div>
                )}
                {messages.map((m, index) => (
                  <Message 
                    key={m.key} 
                    message={m} 
                    previousMessageRole={index > 0 ? messages[index - 1].role : undefined}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Fixed input area at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            onSendClicked();
          }}
        >
          <div className="flex-1 relative max-w-[80%] mx-auto">
            <div className="relative rounded-t-2xl border border-b-0 border-border/50 bg-background/80 backdrop-blur-md shadow-lg shadow-black/5">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                    e.preventDefault();
                    onSendClicked();
                  }
                }}
                className="w-full min-h-[120px] max-h-[200px] rounded-t-2xl rounded-b-none border-0 bg-transparent placeholder:text-muted-foreground/70 resize-none pr-12 pb-10 pt-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={
                  messages.length > 0
                    ? "Continue the conversation..."
                    : "Type your message here..."
                }
                disabled={isStreaming}
              />
              <div className="absolute bottom-3 left-3 flex items-center">
                <ChatModelSelector model={selectedModel} setModel={setSelectedModel} />
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleAbort}
                    className="h-9 w-9 rounded-lg shadow-sm transition-all hover:scale-105"
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!prompt.trim()}
                    className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm hover:shadow-md hover:scale-105"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Message({ message, previousMessageRole }: { message: UIMessage; previousMessageRole?: string }) {
  const isUser = message.role === "user";
  const hasRoleChange = previousMessageRole && previousMessageRole !== message.role;
  const [visibleText] = useSmoothText(message.text, {
    startStreaming: message.status === "streaming",
  });
  const [reasoningText] = useSmoothText(
    message.parts
      .filter((p) => p.type === "reasoning")
      .map((p) => p.text)
      .join("\n") ?? "",
    {
      startStreaming: message.status === "streaming",
    },
  );
  const nameToolCalls = message.parts.filter(
    (p): p is ToolUIPart => p.type === "tool-getCharacterNames",
  );
  
  const isStreaming = message.status === "streaming";
  const isFailed = message.status === "failed";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-center", hasRoleChange && "mt-6")}>
      <div
        className={cn(
          "group relative whitespace-pre-wrap transition-all",
          isUser
            ? "rounded-2xl px-4 py-3 bg-primary text-primary-foreground max-w-[75%] shadow-sm"
            : "w-full px-2 py-4",
          {
            "bg-destructive/10 border-destructive/20 text-destructive rounded-2xl px-4 py-3": isFailed,
          },
        )}
      >
        {reasoningText &&  (
          <div className="mb-3 pb-3 border-b border-border/30">
            <div className="text-xs text-muted-foreground/80 flex items-start gap-2">
              
              <span  className="flex-1 leading-relaxed"> {reasoningText}</span>
            </div>
          </div>
        )}
        {nameToolCalls.length > 0 && (
          <div className="mb-3 pb-3 border-b border-border/30 space-y-1">
            {nameToolCalls.map((p) => (
              <div key={p.toolCallId} className="text-xs text-muted-foreground/80">
                <span className="font-medium">Names generated:</span>{" "}
                {p.output ? (
                  <span className="text-primary">{(p.output as string[]).join(", ")}</span>
                ) : (
                  <span className="text-muted-foreground/60 italic">{p.state}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className={cn(
          "leading-relaxed",
          isUser ? "text-sm" : "text-base text-foreground/90"
        )}>
          {visibleText || (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <LoadingDots />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}