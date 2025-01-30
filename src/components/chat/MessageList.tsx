import { ScrollArea } from "@/components/ui/scroll-area";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useEffect, useState, useRef } from "react";
import MessageContent from "./message/MessageContent";
import MessageAvatar from "./message/MessageAvatar";
import TypingIndicator from "./message/TypingIndicator";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const loadingIndicatorTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle loading indicator with delay to prevent flashing
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      loadingIndicatorTimeoutRef.current = setTimeout(() => {
        setShowLoadingIndicator(true);
      }, 500);
    } else {
      if (loadingIndicatorTimeoutRef.current) {
        clearTimeout(loadingIndicatorTimeoutRef.current);
      }
      setShowLoadingIndicator(false);
    }

    return () => {
      if (loadingIndicatorTimeoutRef.current) {
        clearTimeout(loadingIndicatorTimeoutRef.current);
      }
    };
  }, [isLoading, messages.length]);

  // Handle scroll behavior
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      if (userScrolled) {
        setShouldAutoScroll(isNearBottom);
      }
      
      if (!isNearBottom) {
        setUserScrolled(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);

    if (shouldAutoScroll && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [messages, shouldAutoScroll, userScrolled]);

  // Reset scroll behavior when conversation changes
  useEffect(() => {
    setUserScrolled(false);
    setShouldAutoScroll(true);
  }, [messages[0]?.id]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`flex items-end gap-2 ${
              msg.is_ai ? "justify-start" : "justify-end"
            } animate-fadeIn`}
          >
            {msg.is_ai && (
              <MessageAvatar 
                isAi={true}
                imageUrl={selectedPhilosopher?.profile_image_url}
                name={selectedPhilosopher?.name}
              />
            )}
            <MessageContent 
              content={msg.content}
              isAi={msg.is_ai}
              createdAt={msg.created_at}
            />
            {!msg.is_ai && <MessageAvatar isAi={false} />}
          </div>
        ))}
        {showLoadingIndicator && (
          <div className="flex items-end gap-2 justify-start animate-fadeIn">
            <TypingIndicator 
              imageUrl={selectedPhilosopher?.profile_image_url}
              name={selectedPhilosopher?.name}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;