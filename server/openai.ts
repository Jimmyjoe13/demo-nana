import OpenAI from "openai";
import { Message, ChatConfig } from "@shared/schema";
import { defaultConfig } from "./config";
import { systemPrompts } from "@/config/prompts";

// Helper to get system prompt text from config
function getSystemPromptText(config: ChatConfig): string {
  if (config.systemPrompt === "custom" && config.customPrompt) {
    return config.customPrompt;
  }
  
  // Find system prompt based on ID
  const systemPromptObj = systemPrompts.find(p => p.id === config.systemPrompt);
  return systemPromptObj?.prompt || defaultConfig.systemPromptText;
}

// Create a function to generate chat responses
export async function generateChatResponse(
  messages: Message[],
  config: ChatConfig
): Promise<string> {
  // Vérifie si la clé API d'environnement existe
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in environment variables");
    return "Configuration du serveur incorrecte. Veuillez contacter l'administrateur.";
  }
  
  try {
    // Utilisation exclusive de la clé API de l'environnement
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY
    });

    // Format messages for OpenAI API
    const systemPromptText = getSystemPromptText(config);
    
    const formattedMessages = [
      {
        role: "system" as const,
        content: systemPromptText
      },
      ...messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }))
    ];

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const modelToUse = config.model === "gpt-4o" || config.model === "gpt-4" || config.model === "gpt-3.5-turbo" 
      ? config.model 
      : "gpt-3.5-turbo"; // Fallback for non-OpenAI models

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: modelToUse,
      messages: formattedMessages as any, // Forçage de type pour éviter les erreurs TypeScript
      temperature: config.temperature,
      max_tokens: 1000,
    });

    // Extract and return response content
    return response.choices[0].message.content || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Error generating response from OpenAI:", error);
    return "Une erreur est survenue lors de la génération de la réponse. Veuillez réessayer ultérieurement.";
  }
}
