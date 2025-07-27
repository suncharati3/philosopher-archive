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
          // Process mixed content within a paragraph
          const processedContent = processMixedContent(paragraph);
          return (
            <div key={index} className="leading-relaxed">
              {processedContent}
            </div>
          );
        })}
      </div>
    );
  };

  // Function to process mixed content (actions, quotes, speech, narrative)
  const processMixedContent = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Handle full paragraph action descriptions first
    if (text.startsWith('*') && text.endsWith('*') && text.match(/^\*[^*]+\*$/)) {
      return (
        <div className="action-description">
          {text.slice(1, -1)}
        </div>
      );
    }

    // Handle speaker labels (Name: text)
    const speakerMatch = text.match(/^([A-Za-z\s]+):\s(.+)$/);
    if (speakerMatch) {
      return (
        <>
          <span className="speaker-label">{speakerMatch[1]}:</span>{' '}
          <span className="narrative-text">{processMixedContent(speakerMatch[2])}</span>
        </>
      );
    }

    // Process text with mixed content (asterisks and quotes)
    while (currentIndex < text.length) {
      // Find next special marker
      const nextAsterisk = text.indexOf('*', currentIndex);
      const nextQuote = text.indexOf('"', currentIndex);
      
      let nextMarker = -1;
      let markerType = '';
      
      if (nextAsterisk !== -1 && (nextQuote === -1 || nextAsterisk < nextQuote)) {
        nextMarker = nextAsterisk;
        markerType = 'asterisk';
      } else if (nextQuote !== -1) {
        nextMarker = nextQuote;
        markerType = 'quote';
      }
      
      if (nextMarker === -1) {
        // No more markers, add remaining text as narrative
        if (currentIndex < text.length) {
          const remainingText = text.slice(currentIndex);
          if (remainingText.trim()) {
            parts.push(
              <span key={parts.length} className="narrative-text">
                {remainingText}
              </span>
            );
          }
        }
        break;
      }
      
      // Add text before marker as narrative
      if (nextMarker > currentIndex) {
        const beforeText = text.slice(currentIndex, nextMarker);
        if (beforeText.trim()) {
          parts.push(
            <span key={parts.length} className="narrative-text">
              {beforeText}
            </span>
          );
        }
      }
      
      if (markerType === 'asterisk') {
        // Find closing asterisk
        const closingAsterisk = text.indexOf('*', nextMarker + 1);
        if (closingAsterisk !== -1) {
          const actionText = text.slice(nextMarker + 1, closingAsterisk);
          parts.push(
            <span key={parts.length} className="action-description">
              {actionText}
            </span>
          );
          currentIndex = closingAsterisk + 1;
        } else {
          // No closing asterisk, treat as regular text
          parts.push(
            <span key={parts.length} className="narrative-text">
              {text.slice(nextMarker)}
            </span>
          );
          break;
        }
      } else if (markerType === 'quote') {
        // Find closing quote
        const closingQuote = text.indexOf('"', nextMarker + 1);
        if (closingQuote !== -1) {
          const quotedText = text.slice(nextMarker + 1, closingQuote);
          parts.push(
            <span key={parts.length} className="quoted-speech">
              "{quotedText}"
            </span>
          );
          currentIndex = closingQuote + 1;
        } else {
          // No closing quote, treat as regular text
          parts.push(
            <span key={parts.length} className="narrative-text">
              {text.slice(nextMarker)}
            </span>
          );
          break;
        }
      }
    }
    
    return parts.length > 0 ? parts : <span className="narrative-text">{text}</span>;
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