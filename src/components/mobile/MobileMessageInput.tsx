import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileMessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MobileMessageInput = ({ onSendMessage, isLoading }: MobileMessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isMobile) return null;

  return (
    <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur border-t border-border/40">
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or share your thoughts..."
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-primary/20 focus-visible:ring-primary/30 text-base"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className="h-11 w-11 rounded-xl p-0 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MobileMessageInput;