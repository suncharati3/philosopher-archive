import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { TokenBalanceDisplay } from "../tokens/TokenBalanceDisplay";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
}

const MobileChatHeader = ({ isPublicMode, setIsPublicMode }: MobileChatHeaderProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  if (!isMobile || !selectedPhilosopher) return null;

  const handleModeChange = (checked: boolean) => {
    setIsPublicMode(checked);
  };

  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border/40">
      <div className="p-3 space-y-3">
        {/* Philosopher Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={selectedPhilosopher.profile_image_url || "/placeholder.svg"}
              alt={selectedPhilosopher.name}
            />
            <AvatarFallback>
              {selectedPhilosopher.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">
              {selectedPhilosopher.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {selectedPhilosopher.era}
            </p>
          </div>
          <TokenBalanceDisplay />
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="confession-mode"
              checked={!isPublicMode}
              onCheckedChange={(checked) => handleModeChange(!checked)}
            />
            <Label htmlFor="confession-mode" className="text-sm">
              Confession Mode
            </Label>
          </div>
        </div>

        {/* Confession Mode Alert */}
        {!isPublicMode && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Private mode: Messages are not saved
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MobileChatHeader;