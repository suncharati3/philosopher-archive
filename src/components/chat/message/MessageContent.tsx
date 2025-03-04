import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  isAi: boolean;
  createdAt: string;
}

const MessageContent = ({ content, isAi, createdAt }: MessageContentProps) => {
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

  return (
    <div
      className={`group relative max-w-[80%] rounded-2xl p-4 ${
        isAi
          ? "bg-gradient-to-br from-muted to-card border border-border/50 text-foreground"
          : "bg-gradient-to-br from-primary/90 to-primary text-white shadow-lg"
      }`}
    >
      <div className={`text-sm md:text-base ${isAi ? 'text-foreground' : 'text-white'}`}>
        {formatMessageContent(content, isAi)}
      </div>
      <span
        className={`mt-1 block text-xs ${
          isAi ? "text-muted-foreground" : "text-white/80"
        }`}
      >
        {format(new Date(createdAt), "h:mm a")}
      </span>
    </div>
  );
};

export default MessageContent;