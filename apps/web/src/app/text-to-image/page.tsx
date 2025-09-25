import { preloadQuery } from "convex/nextjs";
import { api } from "@imageflow/convex/_generated/api";
import TextToImageWrapper from "@/components/text-to-image-wrapper";

export default async function TextToImage() {
    const image = await preloadQuery(api.image.getImages);

    return <TextToImageWrapper preloadedImages={image} />;
}
