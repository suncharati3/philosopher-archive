import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
  onNewChat: () => void;
}

const ChatHeader = ({ isPublicMode, setIsPublicMode, onNewChat }: ChatHeaderProps) => {
  return (
    <div className="border-b border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;