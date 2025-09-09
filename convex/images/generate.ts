import { v } from "convex/values";
import { internalAction, mutation } from "../_generated/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { api, internal } from "../_generated/api";
import { Effect } from "effect";

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const generateImages = internalAction({
  args: {
    prompt: v.string(),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
  },
  handler: async (ctx, args) => {
    const program = Effect.gen(function* (_) {
      const { prompt, imageWidth, imageHeight, originalImageId } = args;

      // Generate images with Effect
      const result = yield* _(
        Effect.tryPromise({
          try: () =>
            generateText({
              model: google("gemini-2.5-flash-image-preview"),
              providerOptions: { google: { responseModalities: ["TEXT", "IMAGE"] } },
              prompt,
            }),
          catch: (error) => new Error(`Failed to generate Image: ${error}`),
        })
      );

      const storedImages = [];

      // Process each file
      for (const file of result.files) {
        if (file.mediaType?.startsWith("image/")) {
          const base64Data = file.base64.includes(",")
            ? file.base64.split(",")[1]
            : file.base64;

          const bytes = base64ToUint8Array(base64Data);
          const blob = new Blob([bytes], { type: file.mediaType });

          const storageId = yield* _(
            Effect.tryPromise({
              try: () => ctx.storage.store(blob),
              catch: (error) => new Error(`Failed to store image: ${error}`),
            })
          );

          const url = yield* _(
            Effect.tryPromise({
              try: () => ctx.storage.getUrl(storageId),
              catch: (error) => new Error(`Failed to get image URL: ${error}`),
            })
          );

          // Fix: Use runMutation as an Effect
          yield* _(
            Effect.tryPromise({
              try: async (): Promise<void> => {
                await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                  body: storageId,
                  originalImageId: originalImageId,
                  prompt,
                  model: "gemini-2.5-flash-image-preview",
                  imageWidth: imageWidth ?? 1024,
                  imageHeight: imageHeight ?? 1024,
                  numberOfImages: 1,
                  status: "generated",
                  storageId: args.storageId,
                });
              },
              catch: (error) => new Error(`Failed to save image: ${error}`),
            })
          );

          storedImages.push({
            storageId,
            mediaType: file.mediaType,
            size: bytes.length,
            url,
          });
        }
      }

      return storedImages;
    }).pipe(
      Effect.tapError((err) => Effect.sync(() => console.error("Error in generateImages:", err)))
    );

    // Fix: Properly handle the Effect execution
    try {
      return await Effect.runPromise(program);
    } catch (error) {
      console.error("Failed to execute generateImages program:", error);
      throw error;
    }
  },
});

export const scheduleImageGeneration = mutation({
  args: {
    prompt: v.string(),
    imageWidth: v.number(),
    imageHeight: v.number(),
    model: v.optional(v.string()),
    numberOfImages: v.number(), 
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
  },
  handler: async (ctx, args) => {
    const {
      prompt,
      imageWidth,
      imageHeight,
      numberOfImages,
      storageId,
      model,
    } = args;

    const originalImageId = await ctx.db.insert("images", {
      prompt: prompt,
      body: storageId,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      numberOfImages: numberOfImages,
      createdAt: Date.now(),
      status: "running",
      model: model ?? "gemini-2.5-flash-image-preview",
    });

    await ctx.scheduler.runAfter(0, internal.images.imageGen.generateImages, {
      prompt: prompt,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      numberOfImages: numberOfImages,
    });

    return originalImageId;
  },
});
