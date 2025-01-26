import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { User } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useEffect, useState } from "react";

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
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to format message content with different styles
  const formatMessageContent = (content: string, isAi: boolean) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      if (!isAi) {
        // Keep user messages simple and clear
        return <p key={index} className="mb-2 last:mb-0 leading-relaxed">{paragraph}</p>;
      }

      // Format AI messages with special styling
      let formattedText = paragraph;

      // Format narrative/descriptive text (text between < and >)
      formattedText = formattedText.replace(
        /<([^>]+)>/g,
        '<span class="text-muted-foreground italic">$1</span>'
      );

      // Format direct quotes (text between quotation marks)
      formattedText = formattedText.replace(
        /"([^"]+)"/g,
        '<span class="font-medium text-primary">$1</span>'
      );

      // Format key terms (followed by a colon)
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

  // Effect to handle typing animation for the latest AI message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.is_ai) {
      setIsTyping(true);
      setTypingMessage("");
      
      const content = lastMessage.content;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setTypingMessage(prev => prev + content[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30); // Adjust typing speed here
      
      return () => clearInterval(typingInterval);
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg, index) => (
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
                {isTyping && index === messages.length - 1 && msg.is_ai ? (
                  formatMessageContent(typingMessage, msg.is_ai)
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