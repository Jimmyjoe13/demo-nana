import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Conversation, MessageRole, ChatRequest, chatResponseSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useChatConfig } from "@/hooks/use-chat-config";
import { systemPrompts, MAX_MESSAGES_PER_DAY } from "@/config/prompts";
import { toast } from "@/hooks/use-toast";

interface ChatContextType {
  messages: Message[];
  conversation: Conversation | null;
  isLoading: boolean;
  remainingMessages: number;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
  showMessageLimitModal: boolean;
  closeMessageLimitModal: () => void;
  resetChatEnabled: () => void; // Added resetChatEnabled function
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper function to check and update message quota
function useMessageQuota() {
  const [remainingMessages, setRemainingMessages] = useState(MAX_MESSAGES_PER_DAY);
  const [showMessageLimitModal, setShowMessageLimitModal] = useState(false);

  useEffect(() => {
    const checkQuota = () => {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('messageQuota');

      if (storedData) {
        const { date, count } = JSON.parse(storedData);

        if (date === today) {
          setRemainingMessages(MAX_MESSAGES_PER_DAY - count);
        } else {
          // Reset for new day
          localStorage.setItem('messageQuota', JSON.stringify({ date: today, count: 0 }));
          setRemainingMessages(MAX_MESSAGES_PER_DAY);
        }
      } else {
        // Initialize if not exists
        localStorage.setItem('messageQuota', JSON.stringify({ date: today, count: 0 }));
        setRemainingMessages(MAX_MESSAGES_PER_DAY);
      }
    };

    checkQuota();
  }, []);

  const updateMessageCount = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('messageQuota');

    if (storedData) {
      const { date, count } = JSON.parse(storedData);

      if (date === today) {
        const newCount = count + 1;
        localStorage.setItem('messageQuota', JSON.stringify({ date, count: newCount }));
        const remaining = MAX_MESSAGES_PER_DAY - newCount;
        setRemainingMessages(remaining);

        // Show modal if limit reached
        if (remaining <= 0) {
          setShowMessageLimitModal(true);
        }

        return remaining > 0;
      } else {
        // Reset for new day
        localStorage.setItem('messageQuota', JSON.stringify({ date: today, count: 1 }));
        setRemainingMessages(MAX_MESSAGES_PER_DAY - 1);
        return true;
      }
    } else {
      // Initialize if not exists
      localStorage.setItem('messageQuota', JSON.stringify({ date: today, count: 1 }));
      setRemainingMessages(MAX_MESSAGES_PER_DAY - 1);
      return true;
    }
  }, []);

  const closeMessageLimitModal = useCallback(() => {
    setShowMessageLimitModal(false);
  }, []);

  return { remainingMessages, updateMessageCount, showMessageLimitModal, closeMessageLimitModal };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useChatConfig();
  const { remainingMessages, updateMessageCount, showMessageLimitModal, closeMessageLimitModal } = useMessageQuota();

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversation(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // La clé API est désormais fournie par le serveur
    // Nous n'avons plus besoin de vérifier si l'utilisateur l'a définie

    // Check message quota
    if (!updateMessageCount()) {
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user" as MessageRole,
      content,
      timestamp: Date.now()
    };

    // Add user message to state immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get system prompt text
      let systemPromptText = "";
      if (config.systemPrompt === "custom" && config.customPrompt) {
        systemPromptText = config.customPrompt;
      } else {
        const selectedPrompt = systemPrompts.find(p => p.id === config.systemPrompt);
        systemPromptText = selectedPrompt?.prompt || systemPrompts[0].prompt;
      }

      // Prepare request
      const chatRequest: ChatRequest = {
        message: content,
        conversationId: conversation?.id,
        config: {
          ...config,
          // Include resolved system prompt text
          customPrompt: systemPromptText
        }
      };

      // Send request to API
      const response = await apiRequest("POST", "/api/chat", chatRequest);
      const data = await response.json();

      // Validate response
      const validatedResponse = chatResponseSchema.parse(data);

      // Update state with response
      setMessages((prev) => [...prev, validatedResponse.message]);
      setConversation(validatedResponse.conversation);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, conversation, updateMessageCount]);

  const resetChatEnabled = useCallback(() => {
    window.localStorage.setItem('chatEnabled', 'true');
  }, []);


  return (
    <ChatContext.Provider value={{
      messages,
      conversation,
      isLoading,
      remainingMessages,
      sendMessage,
      resetChat,
      showMessageLimitModal,
      closeMessageLimitModal,
      resetChatEnabled // Added resetChatEnabled to the context
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}