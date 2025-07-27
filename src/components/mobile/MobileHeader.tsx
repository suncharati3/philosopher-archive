import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileHeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
}

const MobileHeader = ({ 
  title, 
  onBack, 
  showBackButton = false,
  showMenuButton = true 
}: MobileHeaderProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur border-b border-border/40 p-3 h-14">
      <div className="flex items-center gap-3">
        {showBackButton && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {showMenuButton && (
          <SidebarTrigger className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        )}
      </div>
      
      {title && (
        <h1 className="text-lg font-semibold truncate flex-1 text-center">
          {title}
        </h1>
      )}
      
      <div className="w-8" /> {/* Spacer for centering */}
    </div>
  );
};

export default MobileHeader;