import { Loader } from "lucide-react";
import MessageAvatar from "./MessageAvatar";

interface TypingIndicatorProps {
  imageUrl?: string;
  name?: string;
}

const TypingIndicator = ({ imageUrl, name }: TypingIndicatorProps) => {
  return (
    <div className="flex items-end gap-2 animate-fadeIn">
      <MessageAvatar isAi={true} imageUrl={imageUrl} name={name} />
      <div className="bg-gradient-to-br from-muted to-card border border-border/50 rounded-2xl p-4 max-w-[80%]">
        <div className="flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {name || "Philosopher"} is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;