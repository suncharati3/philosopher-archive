import { format } from "date-fns";

interface MessageContentProps {
  content: string;
  isAi: boolean;
  createdAt: string;
}

const MessageContent = ({ content, isAi, createdAt }: MessageContentProps) => {
  // Enhanced immersive formatting with proper CSS classes
  const formatMessageContent = (content: string, isAi: boolean) => {
    if (!isAi) {
      return <div className="text-sm md:text-base leading-relaxed">{content}</div>;
    }

    // Parse the entire content for immersive formatting
    let formattedContent = content;
    const elements: JSX.Element[] = [];
    let elementIndex = 0;

    // Split by paragraphs first
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => {
          let processedParagraph = paragraph.trim();
          
          // Handle action descriptions (text between single asterisks) - hide asterisks
          if (processedParagraph.startsWith('*') && processedParagraph.endsWith('*') && !processedParagraph.startsWith('**')) {
            return (
              <div key={index} className="action-description">
                {processedParagraph.slice(1, -1)}
              </div>
            );
          }
          
          // Handle quoted speech (text in quotes) - keep quotes but style them
          if (processedParagraph.includes('"')) {
            const parts = processedParagraph.split('"');
            return (
              <div key={index} className="space-y-2">
                {parts.map((part, partIndex) => {
                  if (partIndex % 2 === 1) {
                    // This is quoted text
                    return (
                      <div key={partIndex} className="quoted-speech">
                        "{part}"
                      </div>
                    );
                  }
                  // Regular text around quotes
                  if (part.trim()) {
                    return (
                      <div key={partIndex} className="narrative-text">
                        {part.trim()}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          }
          
          // Handle speaker labels (Name: text)
          const speakerMatch = processedParagraph.match(/^([A-Za-z\s]+):\s(.+)$/);
          if (speakerMatch) {
            return (
              <div key={index} className="space-y-1">
                <div className="speaker-label">{speakerMatch[1]}:</div>
                <div className="narrative-text">{speakerMatch[2]}</div>
              </div>
            );
          }
          
          // Regular narrative paragraph
          return (
            <div key={index} className="narrative-text">
              {processedParagraph}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`group relative ${
        isAi
          ? "philosopher-response"
          : "bg-gradient-to-br from-primary/95 to-primary text-white shadow-primary/25 rounded-2xl p-6 shadow-lg max-w-[90%]"
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