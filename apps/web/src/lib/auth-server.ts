import { getStaticAuth } from "@convex-dev/better-auth";
import { createAuth } from "@imageflow/convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";

export const getToken = () => {
    getStaticAuth(createAuth);
  return getTokenNextjs(createAuth);
};