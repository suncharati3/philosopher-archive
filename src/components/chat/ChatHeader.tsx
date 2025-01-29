import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

interface ChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
  onNewConversation: () => void;
}

const ChatHeader = ({ isPublicMode, setIsPublicMode, onNewConversation }: ChatHeaderProps) => {
  return (
    <div className="border-b border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPublicMode(!isPublicMode)}
          >
            {isPublicMode ? "Switch to Private" : "Switch to Public"}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewConversation}
          className="ml-auto"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;