import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { ChatProvider } from "@/hooks/use-chat";
import { ChatConfigProvider } from "@/hooks/use-chat-config";
import { GoogleServicesProvider } from "@/hooks/use-google-services";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="nana-ai-theme">
      <ChatConfigProvider>
        <GoogleServicesProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </GoogleServicesProvider>
      </ChatConfigProvider>
    </ThemeProvider>
  );
}
