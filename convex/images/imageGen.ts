import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { experimental_generateImage as generateImage } from "ai";
import { Effect } from "effect";
import { api } from "../_generated/api";
import { fal } from '@ai-sdk/fal';



export const generateImages = internalAction({
  args: {
    prompt: v.string(),
    imageWidth: v.number(),
    imageHeight: v.number(),
    numberOfImages: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
  },
  handler : async( ctx, args) =>  {
    const program = Effect.gen(function* (_) {
      const { prompt, imageHeight, imageWidth, numberOfImages, storageId, originalImageId } = args
      const size = `${imageWidth}x${imageHeight}` as `${number}x${number}`;
      
      const { images } = yield* _(
        Effect.tryPromise({
          try: () =>
            generateImage({
              model: fal.image("fal-ai/flux/dev"),
              prompt: prompt,
              size: size,
              n : numberOfImages,
              // providerOptions: {
              //   fal: {
              //     image_url:
              //       'https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png',
              //   },
              // },
            }),
          catch: () => new Error("Error While generating image")
        })
      )

      const storedImages = [];

      for (const image of images) {
        const storageId = yield* _(
          Effect.tryPromise({
            try: () => {
              const copiedBytes = new Uint8Array(image.uint8Array);
              return ctx.storage.store(new Blob([copiedBytes], { type: image.mediaType }));
            },
            catch: () => new Error("Error while storing the images")
          })
        )

        const url = yield* _(
          Effect.tryPromise({
            try: () => ctx.storage.getUrl(storageId),
            catch: (error) => new Error(`Failed to get image URL: ${error}`),
          })
        );

        yield* _(
          Effect.tryPromise({
            try: async (): Promise<void> => {
              await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                body: storageId,
                originalImageId: originalImageId,
                prompt,
                model: "fal-ai/flux/dev",
                imageWidth: imageWidth,
                imageHeight: imageHeight,
                numberOfImages: numberOfImages ?? 1,
                status: "generated",
                storageId: args.storageId,
              });
            },
            catch : () => new Error("Error while persit the data")
          })
        )
        storedImages.push({
          storageId,
          mediaType: image.mediaType,
          url,
        });
      }
     return storageId
    }).pipe(
      Effect.tapError((err) => Effect.sync(() => console.error("Error in generateImages:", err)))
    );
    try {
      return await Effect.runPromise(program);
    } catch (error) {
      console.error("Failed to execute generateImages program:", error);
      throw error;
    }
     
  },
});
