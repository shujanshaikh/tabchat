import { components } from "../_generated/api";
import { Agent } from "@convex-dev/agent";
import { defaultConfig } from "./config";

export const agent = new Agent(components.agent, {
    name: "ImageFlow",
    instructions: "You are an AI assistant that can help with tasks",
    ...defaultConfig,
  });

  export function chatBetterAgent(
    model: string,
  ) {
    return new Agent(components.agent, {
      name: "chatbetter",
      languageModel: model,
      instructions: "You are an AI assistant that can help with tasks",
    });
  }