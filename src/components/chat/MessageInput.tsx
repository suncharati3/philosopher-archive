import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="p-4 border-t border-border">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;