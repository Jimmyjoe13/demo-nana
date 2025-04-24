import { Button } from "@/components/ui/button";
import { Menu, Info } from "lucide-react";
import nanaLogo from "@assets/logo-nana.png";

interface ChatHeaderProps {
  toggleSidebar: () => void;
  title: string;
}

export function ChatHeader({ toggleSidebar, title }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-white dark:bg-neutral-800">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 md:hidden"
          onClick={toggleSidebar}
          aria-label="Afficher/masquer le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 md:hidden">
          <img 
            src={nanaLogo} 
            alt="NANA-AI Logo" 
            className="h-7 w-7 rounded-full object-contain"
          />
          <span className="font-bold text-sm">NANA-AI</span>
        </div>
        
        <h2 className="font-semibold">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
        aria-label="Informations sur la discussion"
      >
        <Info className="h-5 w-5" />
      </Button>
    </div>
  );
}
