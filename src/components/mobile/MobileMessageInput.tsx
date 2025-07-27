import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Mic } from "lucide-react";
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
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 56), 140);
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
        textareaRef.current.style.height = '56px';
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
    <div className="sticky bottom-0 z-30 bg-background border-t border-border/20">
      <div className="px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or share your thoughts..."
              className="min-h-[56px] max-h-[140px] resize-none rounded-[28px] border-border/30 bg-muted/50 px-6 py-4 text-base placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all duration-200"
              disabled={isLoading}
              rows={1}
            />
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className="h-12 w-12 rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </Button>
        </form>
      </div>
      
      {/* Safe area for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </div>
  ) : null;
};

export default MobileMessageInput;