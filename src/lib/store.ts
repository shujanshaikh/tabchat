import { store } from "@simplestack/store";
import { chatModel } from "../../convex/chatModel";



export const chatStore = store({
    selectedModel: chatModel[0]?.id || "",
    prompt: "",
    urls: [] as string[],
    webSearch: false,
});


export const prompt = chatStore.select("prompt");
export const urls = chatStore.select("urls");
export const webSearch = chatStore.select("webSearch");
export const selectedModel = chatStore.select("selectedModel");