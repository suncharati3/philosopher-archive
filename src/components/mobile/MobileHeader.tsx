import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import MobilePhilosopherSidebar from "./MobilePhilosopherSidebar";

interface MobileHeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MobileHeader = ({ 
  title, 
  onBack, 
  showBackButton = false,
  showMenuButton = true,
  menuOpen,
  setMenuOpen
}: MobileHeaderProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
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
          <MobilePhilosopherSidebar 
            isOpen={menuOpen}
            setIsOpen={setMenuOpen}
          />
        )}
      </div>
      
      {title && (
        <h1 className="text-lg font-semibold truncate flex-1 text-center">
          {title}
        </h1>
      )}
      
      <div className="w-8" /> {/* Spacer for centering */}
    </div>
  ) : null;
};

export default MobileHeader;