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
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 48), 120);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return isMobile ? (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/20">
      <div className="px-3 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or share your thoughts..."
              className="min-h-[48px] max-h-[120px] resize-none rounded-[24px] border border-border/40 bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all duration-200 shadow-sm"
              disabled={isLoading}
              rows={1}
            />
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className="h-12 w-12 rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 text-primary-foreground ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  ) : null;
};

export default MobileMessageInput;