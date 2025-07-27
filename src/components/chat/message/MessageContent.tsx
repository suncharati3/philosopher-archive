import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  isAi: boolean;
  createdAt: string;
}

const MessageContent = ({ content, isAi, createdAt }: MessageContentProps) => {
  // Clean function to format message content without HTML classes showing
  const formatMessageContent = (content: string, isAi: boolean) => {
    if (!isAi) {
      return <div className="text-sm md:text-base leading-relaxed">{content}</div>;
    }

    // For AI messages, apply simple text formatting without complex HTML
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => {
          // Handle stage directions in asterisks
          if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
            return (
              <div key={index} className="text-muted-foreground italic text-sm opacity-70">
                {paragraph.slice(1, -1)}
              </div>
            );
          }
          
          // Handle speaker labels (Name: text)
          const speakerMatch = paragraph.match(/^([A-Za-z\s]+):\s(.+)$/);
          if (speakerMatch) {
            return (
              <div key={index} className="leading-relaxed">
                <span className="font-semibold text-foreground">{speakerMatch[1]}:</span>{' '}
                <span>{speakerMatch[2]}</span>
              </div>
            );
          }
          
          // Regular paragraph
          return (
            <div key={index} className="leading-relaxed">
              {paragraph}
            </div>
          );
        })}
      </div>
    );
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