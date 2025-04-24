import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import nanaLogo from "@assets/logo-nana.png";

interface SidebarHeaderProps {
  toggleSidebar: () => void;
}

export function SidebarHeader({ toggleSidebar }: SidebarHeaderProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <img 
            src={nanaLogo} 
            alt="NANA-AI Logo" 
            className="h-10 w-10 rounded-full object-contain"
          />
        </div>
        <h1 className="font-bold text-lg">NANA-AI</h1>
      </div>
      
      <div className="flex gap-2">
        <Button 
          id="theme-toggle" 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700" 
          onClick={toggleTheme}
          aria-label="Changer de thème"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button 
          id="sidebar-toggle" 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 md:hidden" 
          onClick={toggleSidebar}
          aria-label="Afficher/masquer le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
