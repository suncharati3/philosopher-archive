import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { User } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

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

  // Function to format message content with bold text
  const formatMessageContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    // Process each paragraph for bold text and key terms
    return paragraphs.map((paragraph, index) => {
      // Replace text between ** with bold, using different colors based on message type
      const formattedText = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) => `<strong class="font-semibold">${text}</strong>`
      );

      // Add special styling for key terms like "Title:", "Summary:", etc.
      const highlightedText = formattedText.replace(
        /(Title:|Summary:|Publication:|Key Concepts:|Historical Context:|Influence:)/g,
        '<span class="font-semibold text-foreground/90">$1</span>'
      );

      return (
        <p 
          key={index} 
          className="mb-2 last:mb-0"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      );
    });
  };

  return (
    <ScrollArea className="flex-1 p-4 bg-chat-gradient">
      <div className="space-y-4 max-w-4xl mx-auto">
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
              className={`group relative max-w-[80%] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow ${
                msg.is_ai
                  ? "bg-white/90 backdrop-blur-sm border border-border/50 text-foreground"
                  : "bg-message-gradient text-white"
              }`}
            >
              <div className={`text-sm md:text-base ${msg.is_ai ? 'text-foreground' : 'text-white'}`}>
                {formatMessageContent(msg.content)}
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
            <div className="bg-white/90 backdrop-blur-sm border border-border/50 rounded-2xl p-4 max-w-[80%] shadow-md">
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