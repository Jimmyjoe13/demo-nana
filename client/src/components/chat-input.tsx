import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useChatConfig } from "@/hooks/use-chat-config";
import { Send, X, AlertTriangle } from "lucide-react";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();
  const { config } = useChatConfig();

  // Adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  // Adjust height when message changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearMessage = () => {
    setMessage("");
    textareaRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          id="message-input"
          ref={textareaRef}
          placeholder="Écrivez votre message ici..."
          rows={1}
          className="w-full p-3 pr-24 resize-none"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />

        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {message.trim() && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full"
              onClick={clearMessage}
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="submit"
            variant="default"
            size="icon"
            className="p-2 rounded-full"
            disabled={!message.trim() || isLoading}
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {!config.apiKey && (
        <div className="mt-2 text-sm text-warning flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          <span>Clé API manquante. Veuillez configurer votre clé API dans le panneau latéral.</span>
        </div>
      )}
    </div>
  );
}