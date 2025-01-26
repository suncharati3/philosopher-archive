import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { format } from "date-fns";

interface MessageProps {
  content: string;
  is_ai: boolean;
  created_at: string;
  philosopherImage?: string;
  philosopherName?: string;
}

const Message = ({ content, is_ai, created_at, philosopherImage, philosopherName }: MessageProps) => {
  const formatMessageContent = (content: string) => {
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const formattedText = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) => `<strong class="font-semibold">${text}</strong>`
      );

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
    <div className={`flex items-end gap-2 ${is_ai ? "justify-start" : "justify-end"} animate-fadeIn`}>
      {is_ai && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={philosopherImage} alt={philosopherName} />
          <AvatarFallback>{philosopherName?.[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`group relative max-w-[80%] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow ${
          is_ai
            ? "bg-white/90 backdrop-blur-sm border border-border/50 text-foreground"
            : "bg-message-gradient text-white"
        }`}
      >
        <div className={`text-sm md:text-base ${is_ai ? 'text-foreground' : 'text-white'}`}>
          {formatMessageContent(content)}
        </div>
        <span className={`mt-1 block text-xs ${is_ai ? "text-muted-foreground" : "text-white/80"}`}>
          {format(new Date(created_at), "h:mm a")}
        </span>
      </div>
      {!is_ai && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;