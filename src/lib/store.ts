import { store } from "@simplestack/store";
import { chatModel } from "../../convex/chatModel";



export const chatStore = store({
    selectedModel: chatModel[0]?.id || "",
    prompt: "",
    urls: [] as string[],
    webSearch: false,
    forThreadId: "",
    hoverThreadId: false,
});


export const hoverThreadId = chatStore.select("hoverThreadId");
export const forThreadId = chatStore.select("forThreadId");
export const prompt = chatStore.select("prompt");
export const urls = chatStore.select("urls");
export const webSearch = chatStore.select("webSearch");
export const selectedModel = chatStore.select("selectedModel");