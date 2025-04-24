import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ChatConfig, chatConfigSchema } from "@shared/schema";
import { defaultChatConfig } from "@/config/prompts";
import { toast } from "@/hooks/use-toast";

interface ChatConfigContextType {
  config: ChatConfig;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setSystemPrompt: (promptId: string) => void;
  setCustomPrompt: (prompt: string) => void;
  resetConfig: () => void;
}

const ChatConfigContext = createContext<ChatConfigContextType | undefined>(undefined);

export function ChatConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ChatConfig>({
    apiKey: "NANA_API_KEY_IS_SET_ON_SERVER", // Clé fictive mais non vide
    model: defaultChatConfig.model,
    temperature: defaultChatConfig.temperature,
    systemPrompt: defaultChatConfig.systemPrompt,
    customPrompt: defaultChatConfig.customPrompt
  });

  // Load config from localStorage on initial mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("chatConfig");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        const validatedConfig = chatConfigSchema.parse(parsedConfig);
        setConfig(validatedConfig);
      }
    } catch (error) {
      console.error("Error loading chat config:", error);
      // If there's an error, use default config
      localStorage.removeItem("chatConfig");
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatConfig", JSON.stringify(config));
  }, [config]);

  const setApiKey = (apiKey: string) => {
    setConfig((prev) => ({ ...prev, apiKey }));
  };

  const setModel = (model: string) => {
    setConfig((prev) => ({ ...prev, model }));
  };

  const setTemperature = (temperature: number) => {
    setConfig((prev) => ({ ...prev, temperature }));
  };

  const setSystemPrompt = (promptId: string) => {
    setConfig((prev) => ({ ...prev, systemPrompt: promptId }));
  };

  const setCustomPrompt = (prompt: string) => {
    setConfig((prev) => ({ ...prev, customPrompt: prompt }));
  };

  const resetConfig = () => {
    setConfig({
      apiKey: "NANA_API_KEY_IS_SET_ON_SERVER", // Garder la clé API fictive même après réinitialisation
      model: defaultChatConfig.model,
      temperature: defaultChatConfig.temperature,
      systemPrompt: defaultChatConfig.systemPrompt,
      customPrompt: defaultChatConfig.customPrompt
    });
    toast({
      description: "Paramètres réinitialisés avec succès."
    });
  };

  return (
    <ChatConfigContext.Provider value={{
      config,
      setApiKey,
      setModel,
      setTemperature,
      setSystemPrompt,
      setCustomPrompt,
      resetConfig
    }}>
      {children}
    </ChatConfigContext.Provider>
  );
}

export function useChatConfig() {
  const context = useContext(ChatConfigContext);
  if (context === undefined) {
    throw new Error("useChatConfig must be used within a ChatConfigProvider");
  }
  return context;
}
