import { Message } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const formattedTime = format(new Date(message.timestamp), "HH:mm", { locale: fr });
  
  return (
    <div className={cn("flex gap-4", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      )}
      
      <div className="max-w-[80%] md:max-w-[70%] flex flex-col gap-1">
        <div 
          className={cn(
            "px-4 py-2 rounded-2xl break-words font-chat",
            isUser 
              ? "bg-primary text-white rounded-tr-none" 
              : "bg-white dark:bg-neutral-800 rounded-tl-none shadow-sm"
          )}
        >
          {message.content.split("\n").map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div 
          className={cn(
            "text-xs text-neutral-500 dark:text-neutral-400",
            isUser && "text-right"
          )}
        >
          {isUser ? `Vous - ${formattedTime}` : `ConversAI - ${formattedTime}`}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}
