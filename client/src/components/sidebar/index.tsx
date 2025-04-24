import { SidebarHeader } from "./sidebar-header";
import { ModelSelector } from "./model-selector";
import { TemperatureSlider } from "./temperature-slider";
import { SystemPromptSelector } from "./system-prompt-selector";
import { MessageCounter } from "./message-counter";
import { ServicesPanel } from "@/components/services-panel";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useChatConfig } from "@/hooks/use-chat-config";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isExpanded, toggleSidebar }: SidebarProps) {
  const { resetChat } = useChat();
  const { resetConfig } = useChatConfig();
  
  const handleNewChat = () => {
    resetChat();
  };
  
  const handleResetSettings = () => {
    resetConfig();
  };
  
  return (
    <div 
      className={cn(
        "w-80 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex flex-col h-full transition-all duration-300 shadow-md",
        isExpanded ? "w-80" : "-ml-80 w-0 md:ml-0 md:w-80"
      )}
    >
      <SidebarHeader toggleSidebar={toggleSidebar} />
      
      <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1">
        <ModelSelector />
        <TemperatureSlider />
        <SystemPromptSelector />
        
        {/* Nouveau panneau de services Google */}
        <ServicesPanel />
      </div>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
        <MessageCounter />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResetSettings}
          >
            Réinitialiser
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleNewChat}
          >
            Nouvelle discussion
          </Button>
        </div>
      </div>
    </div>
  );
}
