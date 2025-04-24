import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { MessageLimitModal } from "@/components/message-limit-modal";
import { useChat } from "@/hooks/use-chat";

export function ChatContainer() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { conversation } = useChat();

  // Added to enable chat even if webhook is not properly configured.
  const isChatEnabled = localStorage.getItem('chatEnabled') === 'true' || true;


  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const chatTitle = conversation?.title || "Nouvelle discussion";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader toggleSidebar={toggleSidebar} title={chatTitle} />
        <ChatMessages />
        {isChatEnabled && <ChatInput />} {/* conditionally render ChatInput */}
      </div>

      <MessageLimitModal />
    </div>
  );
}