import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  isAi: boolean;
  createdAt: string;
}

const MessageContent = ({ content, isAi, createdAt }: MessageContentProps) => {
  // Enhanced immersive formatting for philosopher responses
  const formatMessageContent = (content: string, isAi: boolean) => {
    if (!isAi) {
      return <div className="text-sm md:text-base leading-relaxed">{content}</div>;
    }

    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => {
          // Handle action descriptions (text between asterisks)
          if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
            return (
              <div key={index} className="text-muted-foreground/80 italic text-sm leading-relaxed bg-muted/20 px-3 py-2 rounded-lg border-l-2 border-muted-foreground/30">
                {paragraph.slice(1, -1)}
              </div>
            );
          }
          
          // Handle quoted speech (text in quotes)
          if (paragraph.includes('"')) {
            const parts = paragraph.split('"');
            return (
              <div key={index} className="leading-relaxed">
                {parts.map((part, partIndex) => {
                  if (partIndex % 2 === 1) {
                    // This is quoted text
                    return (
                      <span key={partIndex} className="font-medium text-primary bg-primary/5 px-2 py-1 rounded border-l-2 border-primary/40 italic">
                        "{part}"
                      </span>
                    );
                  }
                  return <span key={partIndex}>{part}</span>;
                })}
              </div>
            );
          }
          
          // Handle speaker labels (Name: text)
          const speakerMatch = paragraph.match(/^([A-Za-z\s]+):\s(.+)$/);
          if (speakerMatch) {
            return (
              <div key={index} className="leading-relaxed">
                <span className="font-bold text-foreground text-lg">{speakerMatch[1]}:</span>{' '}
                <span className="text-foreground/90">{speakerMatch[2]}</span>
              </div>
            );
          }
          
          // Regular narrative paragraph
          return (
            <div key={index} className="leading-relaxed text-foreground/90 font-medium">
              {paragraph}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`group relative max-w-[90%] rounded-2xl p-6 shadow-lg ${
        isAi
          ? "bg-gradient-to-br from-card/90 to-muted/70 border border-border/30 text-foreground backdrop-blur-sm"
          : "bg-gradient-to-br from-primary/95 to-primary text-white shadow-primary/25"
      }`}
    >
      <div className={`text-sm md:text-base ${isAi ? 'text-foreground' : 'text-white'}`}>
        {formatMessageContent(content, isAi)}
      </div>
      <span
        className={`mt-3 block text-xs font-medium ${
          isAi ? "text-muted-foreground/60" : "text-white/60"
        }`}
      >
        {format(new Date(createdAt), "h:mm a")}
      </span>
    </div>
  );
};

export default MessageContent;