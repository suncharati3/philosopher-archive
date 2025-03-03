
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Lock } from "lucide-react";
import { TokenBalanceDisplay } from "@/components/tokens/TokenBalanceDisplay";

interface ChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
}

const ChatHeader = ({ isPublicMode, setIsPublicMode }: ChatHeaderProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  const handleModeChange = (checked: boolean) => {
    setIsPublicMode(!checked); // Invert because checked means confession mode
    console.log("Chat mode changed:", !checked ? "public" : "confession");
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={selectedPhilosopher?.profile_image_url}
            alt={selectedPhilosopher?.name}
          />
          <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{selectedPhilosopher?.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPhilosopher?.era}
          </p>
        </div>
        <TokenBalanceDisplay />
        <div className="flex items-center gap-2">
          <Switch
            id="confession-mode"
            checked={!isPublicMode}
            onCheckedChange={handleModeChange}
          />
          <Label htmlFor="confession-mode" className="flex items-center gap-1 whitespace-nowrap">
            {!isPublicMode && <Lock className="h-4 w-4" />}
            Confession Mode
          </Label>
        </div>
      </div>
      {!isPublicMode && (
        <Alert className="mx-4 mb-4 bg-muted border-muted-foreground/20">
          <AlertDescription className="text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Confession mode active - Your conversation will not be saved
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatHeader;
