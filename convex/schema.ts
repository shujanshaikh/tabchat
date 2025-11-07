import { vProviderMetadata, vUsage } from "@convex-dev/agent";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  images: defineTable({
    prompt: v.string(),
    model: v.string(),
    userId : v.string(),
    url : v.optional(v.string()),
    body: v.optional(v.string()),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    numberOfImages: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("generated"),
        v.literal("failed"),
        v.literal("running"),
      ),
    ),
    originalImageId: v.optional(v.string()),
    isGenerated: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    fileName: v.optional(v.string()),
  }).index("userId", ["userId"]),
  
  rawUsage: defineTable({
    userId: v.string(),
    agentName: v.optional(v.string()),
    model: v.string(),
    provider: v.string(),

    // stats
    usage: vUsage,
    providerMetadata: v.optional(vProviderMetadata),
    billingPeriod: v.string(), // When the usage period ended
  }).index("billingPeriod_userId", ["billingPeriod", "userId"]),

  invoices: defineTable({
    userId: v.string(),
    billingPeriod: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
    ),
  }).index("billingPeriod_userId", ["billingPeriod", "userId"]),

});
