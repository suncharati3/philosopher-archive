import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  isAi: boolean;
  createdAt: string;
}

const MessageContent = ({ content, isAi, createdAt }: MessageContentProps) => {
  // Enhanced function to format message content with better immersive styling
  const formatMessageContent = (content: string, isAi: boolean) => {
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      if (!isAi) {
        return <p key={index} className="mb-2 last:mb-0 leading-relaxed text-sm md:text-base">{paragraph}</p>;
      }

      let formattedText = paragraph;
      
      // Enhanced formatting for philosopher responses
      
      // Style actions and stage directions (text between asterisks)
      formattedText = formattedText.replace(
        /\*([^*]+)\*/g,
        '<span class="text-muted-foreground italic text-sm block mb-2 opacity-80">$1</span>'
      );
      
      // Style quoted text with better emphasis
      formattedText = formattedText.replace(
        /"([^"]+)"/g,
        '<span class="font-medium text-primary bg-primary/5 px-1 rounded">$1</span>'
      );
      
      // Style speaker introductions (word followed by colon)
      formattedText = formattedText.replace(
        /^([A-Za-z\s]+):\s/g,
        '<span class="font-semibold text-foreground block mb-1">$1:</span>'
      );
      
      // Style emphasis words (words in caps)
      formattedText = formattedText.replace(
        /\b([A-Z]{2,})\b/g,
        '<span class="font-semibold text-primary">$1</span>'
      );

      return (
        <div 
          key={index} 
          className="mb-3 last:mb-0 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  return (
    <div
      className={`group relative max-w-[85%] rounded-2xl p-5 shadow-sm ${
        isAi
          ? "bg-gradient-to-br from-card/80 to-muted/60 border border-border/40 text-foreground backdrop-blur-sm"
          : "bg-gradient-to-br from-primary/90 to-primary text-white shadow-lg shadow-primary/20"
      }`}
    >
      <div className={`text-sm md:text-base leading-relaxed ${isAi ? 'text-foreground' : 'text-white'}`}>
        {formatMessageContent(content, isAi)}
      </div>
      <span
        className={`mt-2 block text-xs font-medium ${
          isAi ? "text-muted-foreground/70" : "text-white/70"
        }`}
      >
        {format(new Date(createdAt), "h:mm a")}
      </span>
    </div>
  );
};

export default MessageContent;