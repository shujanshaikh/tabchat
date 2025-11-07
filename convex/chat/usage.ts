import { vProviderMetadata, vUsage, UsageHandler } from "@convex-dev/agent";
import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
  

export const usageHandler: UsageHandler = async (ctx, args) => {
    if (!args.userId) {
      console.debug("Not tracking usage for anonymous user");
      return;
    }
    await ctx.runMutation(internal.chat.usage.insertRawUsage, {
      userId: args.userId,
      agentName: args.agentName,
      model: args.model,
      provider: args.provider,
      usage: {
        promptTokens: args.usage.inputTokens ?? 0,
        completionTokens: args.usage.outputTokens ?? 0,
        totalTokens: (args.usage.inputTokens ?? 0) + (args.usage.outputTokens ?? 0),
        reasoningTokens: args.usage.reasoningTokens ?? 0,
      },
      providerMetadata: args.providerMetadata,
    });
  };
  
  export const insertRawUsage = internalMutation({
    args: {
      userId: v.string(),
      agentName: v.optional(v.string()),
      model: v.string(),
      provider: v.string(),
      usage: vUsage,
      providerMetadata: v.optional(vProviderMetadata),
    },
    handler: async (ctx, args) => {
      const billingPeriod = getBillingPeriod(Date.now());
      return await ctx.db.insert("rawUsage", {
        ...args,
        billingPeriod,
      });
    },
  });
  
  function getBillingPeriod(at: number) {
    const now = new Date(at);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth());
    return startOfMonth.toISOString().split("T")[0];
  }