
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
  isNewMessage?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [typingContent, setTypingContent] = useState("");
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(new Set());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle typing animation for new AI messages only
  useEffect(() => {
    const animateNewMessage = async () => {
      const newAiMessages = messages.filter(msg => 
        msg.is_ai && 
        msg.isNewMessage && 
        !animatedMessages.has(msg.id)
      );
      
      if (newAiMessages.length === 0) return;

      const latestNewMessage = newAiMessages[newAiMessages.length - 1];
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      setCurrentTypingMessage(latestNewMessage.id);
      const content = latestNewMessage.content;
      setTypingContent("");
      
      // Animate typing character by character
      for (let i = 0; i <= content.length; i++) {
        setTypingContent(content.slice(0, i));
        await new Promise(resolve => {
          typingTimeoutRef.current = setTimeout(resolve, 25);
        });
      }
      
      // Mark message as animated and clear typing state
      setAnimatedMessages(prev => new Set(prev).add(latestNewMessage.id));
      setTimeout(() => {
        setCurrentTypingMessage(null);
        setTypingContent("");
      }, 100);
    };

    animateNewMessage();
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [messages, animatedMessages]);

  // Scroll to bottom when messages change or on load
  useEffect(() => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll behavior
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Only set userScrolled if they've actually scrolled up
      if (!isNearBottom) {
        setUserScrolled(true);
        setShouldAutoScroll(false);
      } else if (isNearBottom && userScrolled) {
        // If they scroll near the bottom again, resume auto-scrolling
        setShouldAutoScroll(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [userScrolled]);

  // Reset states when conversation changes
  useEffect(() => {
    // Clear all typing states when messages are cleared or conversation changes
    if (messages.length === 0) {
      setUserScrolled(false);
      setShouldAutoScroll(true);
      setCurrentTypingMessage(null);
      setTypingContent("");
      setAnimatedMessages(new Set());
      
      // Clear any pending animation
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  }, [messages.length]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`flex items-end gap-3 ${
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
              content={
                msg.is_ai && msg.id === currentTypingMessage && msg.isNewMessage 
                  ? typingContent 
                  : msg.content
              }
              isAi={msg.is_ai}
              createdAt={msg.created_at}
            />
            {!msg.is_ai && <MessageAvatar isAi={false} />}
          </div>
        ))}
        {isLoading && (
          <div className="animate-fadeIn">
            <TypingIndicator 
              imageUrl={selectedPhilosopher?.profile_image_url}
              name={selectedPhilosopher?.name}
            />
          </div>
        )}
        {/* Invisible element at the end for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
