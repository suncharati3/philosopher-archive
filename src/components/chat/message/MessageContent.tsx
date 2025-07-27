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
      <div className="philosopher-response">
        {paragraphs.map((paragraph, index) => {
          // Handle action descriptions (text between asterisks) - hide asterisks, apply styling
          if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
            return (
              <div key={index} className="action-description">
                {paragraph.slice(1, -1)}
              </div>
            );
          }
          
          // Handle quoted speech (text in quotes) - make prominent
          if (paragraph.includes('"')) {
            const parts = paragraph.split('"');
            return (
              <div key={index} className="leading-relaxed">
                {parts.map((part, partIndex) => {
                  if (partIndex % 2 === 1) {
                    // This is quoted text - make it stand out
                    return (
                      <span key={partIndex} className="quoted-speech">
                        "{part}"
                      </span>
                    );
                  }
                  // Regular text around quotes
                  return <span key={partIndex} className="narrative-text">{part}</span>;
                })}
              </div>
            );
          }
          
          // Handle speaker labels (Name: text) - make bold
          const speakerMatch = paragraph.match(/^([A-Za-z\s]+):\s(.+)$/);
          if (speakerMatch) {
            return (
              <div key={index} className="leading-relaxed">
                <span className="speaker-label">{speakerMatch[1]}:</span>{' '}
                <span className="narrative-text">{speakerMatch[2]}</span>
              </div>
            );
          }
          
          // Regular narrative paragraph
          return (
            <div key={index} className="narrative-text">
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