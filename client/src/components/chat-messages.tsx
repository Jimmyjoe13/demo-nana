import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { MessageItem } from "./message-item";
import { TypingIndicator } from "./typing-indicator";
import { suggestions, welcomeMessage } from "@/config/prompts";
import { Button } from "@/components/ui/button";

export function ChatMessages() {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const handleSuggestionClick = (message: string) => {
    sendMessage(message);
  };
  
  return (
    <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50 dark:bg-neutral-900">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
          <div className="text-primary text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold">{welcomeMessage.title}</h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            {welcomeMessage.content}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-3 justify-start h-auto text-left hover:bg-white dark:hover:bg-neutral-800"
                onClick={() => handleSuggestionClick(suggestion.message)}
              >
                <div className="flex flex-col items-start">
                  <div className="font-medium">{suggestion.title}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                    "{suggestion.message}"
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
