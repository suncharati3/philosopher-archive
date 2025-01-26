import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { User } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useEffect, useState, useRef } from "react";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [typingContent, setTypingContent] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Function to format message content with different styles
  const formatMessageContent = (content: string, isAi: boolean) => {
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      if (!isAi) {
        return <p key={index} className="mb-2 last:mb-0 leading-relaxed">{paragraph}</p>;
      }

      let formattedText = paragraph;
      formattedText = formattedText.replace(
        /<([^>]+)>/g,
        '<span class="text-muted-foreground italic">$1</span>'
      );
      formattedText = formattedText.replace(
        /"([^"]+)"/g,
        '<span class="font-medium text-primary">$1</span>'
      );
      formattedText = formattedText.replace(
        /(\w+):\s/g,
        '<span class="font-semibold">$1: </span>'
      );

      return (
        <p 
          key={index} 
          className="mb-2 last:mb-0 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  // Effect to handle typing animation for the latest AI message only
  useEffect(() => {
    const animateLatestMessage = async () => {
      const aiMessages = messages.filter(msg => msg.is_ai);
      if (aiMessages.length === 0) return;

      const latestAiMessage = aiMessages[aiMessages.length - 1];
      
      // If this message was already typed out before, skip animation
      if (latestAiMessage.id === currentTypingMessage) return;
      
      setCurrentTypingMessage(latestAiMessage.id);
      const content = latestAiMessage.content;
      
      for (let i = 0; i <= content.length; i++) {
        setTypingContent(content.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    };

    animateLatestMessage();
  }, [messages]);

  // Handle scroll behavior
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);

    if (shouldAutoScroll) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [messages, typingContent, shouldAutoScroll]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.is_ai ? "justify-start" : "justify-end"
            } animate-fadeIn`}
          >
            {msg.is_ai && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={selectedPhilosopher?.profile_image_url}
                  alt={selectedPhilosopher?.name}
                />
                <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`group relative max-w-[80%] rounded-2xl p-4 ${
                msg.is_ai
                  ? "bg-gradient-to-br from-muted to-card border border-border/50 text-foreground"
                  : "bg-gradient-to-br from-primary/90 to-primary text-white shadow-lg"
              }`}
            >
              <div className={`text-sm md:text-base ${msg.is_ai ? 'text-foreground' : 'text-white'}`}>
                {msg.is_ai && msg.id === currentTypingMessage ? (
                  formatMessageContent(typingContent, msg.is_ai)
                ) : (
                  formatMessageContent(msg.content, msg.is_ai)
                )}
              </div>
              <span
                className={`mt-1 block text-xs ${
                  msg.is_ai ? "text-muted-foreground" : "text-white/80"
                }`}
              >
                {format(new Date(msg.created_at), "h:mm a")}
              </span>
            </div>
            {!msg.is_ai && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start animate-fadeIn">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={selectedPhilosopher?.profile_image_url}
                alt={selectedPhilosopher?.name}
              />
              <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-br from-muted to-card border border-border/50 rounded-2xl p-4 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;