import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  isLoading,
}: MessageInputProps) => {
  return (
    <div className="border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px] resize-none pr-12"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className="self-end"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="ml-2">{isLoading ? "Sending..." : "Send"}</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;