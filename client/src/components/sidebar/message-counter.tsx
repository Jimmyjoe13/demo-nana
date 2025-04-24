import { useChat } from "@/hooks/use-chat";
import { MAX_MESSAGES_PER_DAY } from "@/config/prompts";

export function MessageCounter() {
  const { remainingMessages } = useChat();
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">Messages restants</div>
      <div className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-md text-sm font-medium">
        <span>{remainingMessages}</span>
        <span className="text-neutral-500 dark:text-neutral-400">/{MAX_MESSAGES_PER_DAY}</span>
      </div>
    </div>
  );
}
