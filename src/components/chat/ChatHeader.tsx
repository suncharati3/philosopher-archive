import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface ChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
}

const ChatHeader = ({ isPublicMode, setIsPublicMode }: ChatHeaderProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <div className="flex items-center gap-2">
          <Switch
            id="public-mode"
            checked={isPublicMode}
            onCheckedChange={setIsPublicMode}
          />
          <Label htmlFor="public-mode">Public Chat</Label>
        </div>
      </div>
      {!isPublicMode && (
        <Alert variant="destructive" className="mx-4 mb-4 bg-destructive/5 text-destructive">
          <AlertDescription>
            Confession conversations are private and not saved
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatHeader;