import { v } from "convex/values";
import { action } from "../_generated/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const generate = action({
    args : {
        prompt: v.string(),
    } , handler : async (ctx, args) => {
        try {
            const { prompt } = args;
            
            const result = await generateText({
                model: google("gemini-2.5-flash-image-preview"),
                providerOptions: {
                  google: { responseModalities: ['TEXT', 'IMAGE'] },
                },
                prompt: prompt,
            });
            
            
            // Look for image files
            for (const file of result.files) {
                if (file.mediaType && file.mediaType.startsWith('image/')) {
                    // Extract base64 from data URL if needed
                    const base64 = file.base64.includes(',') 
                        ? file.base64.split(',')[1] 
                        : file.base64;
                    return base64;
                }
            }
            
            return null;
        } catch (error) {
            console.error("Error in generate action:", error);
            throw error;
        }
    },
})