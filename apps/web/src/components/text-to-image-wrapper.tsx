
"use client";

import ImageStudio from "@/components/text-to-image";
import SignInUpWrapper from "./sign-in-up-wrapper";
import { Preloaded } from "convex/react";

import {
    Authenticated,
    Unauthenticated,
} from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TextToImageWrapper({ preloadedImages }: { preloadedImages: Preloaded<typeof api.image.getImages> }) {
    return (
        <>
            <Authenticated>
                <ImageStudio images={preloadedImages} />
            </Authenticated>
            <Unauthenticated>
                <SignInUpWrapper />
            </Unauthenticated>
        </>
    );
}
