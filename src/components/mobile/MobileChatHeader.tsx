import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { TokenBalanceDisplay } from "../tokens/TokenBalanceDisplay";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Shield, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface MobileChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
}

const MobileChatHeader = ({ isPublicMode, setIsPublicMode }: MobileChatHeaderProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  const handleModeChange = (checked: boolean) => {
    setIsPublicMode(checked);
  };

  return (isMobile && selectedPhilosopher) ? (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border/20">
      <div className="px-4 py-3">
        {/* Philosopher Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage
                src={selectedPhilosopher.profile_image_url || "/placeholder.svg"}
                alt={selectedPhilosopher.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {selectedPhilosopher.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base truncate">
                {selectedPhilosopher.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {selectedPhilosopher.era}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TokenBalanceDisplay />
            
            {/* Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <Label htmlFor="confession-mode-dropdown" className="text-sm cursor-pointer">
                        Confession Mode
                      </Label>
                    </div>
                    <Switch
                      id="confession-mode-dropdown"
                      checked={!isPublicMode}
                      onCheckedChange={(checked) => handleModeChange(!checked)}
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Confession Mode Alert - Only show when active */}
        {!isPublicMode && (
          <Alert className="mt-3 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Confession mode active - Messages are not saved
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  ) : null;
};

export default MobileChatHeader;