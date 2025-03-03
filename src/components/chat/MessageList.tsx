import { ScrollArea } from "@/components/ui/scroll-area";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useEffect, useState, useRef } from "react";
import MessageContent from "./message/MessageContent";
import MessageAvatar from "./message/MessageAvatar";
import TypingIndicator from "./message/TypingIndicator";
import { Message } from "@/hooks/useChat";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [typingContent, setTypingContent] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateLatestMessage = async () => {
      const aiMessages = messages.filter(msg => msg.is_ai);
      if (aiMessages.length === 0) return;

      const latestAiMessage = aiMessages[aiMessages.length - 1];
      
      if (latestAiMessage.id === currentTypingMessage) {
        return;
      }

      setCurrentTypingMessage(latestAiMessage.id);
      const content = latestAiMessage.content;
      
      for (let i = 0; i <= content.length; i++) {
        if (latestAiMessage.id !== currentTypingMessage) {
          setTypingContent(content.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      }
    };

    animateLatestMessage();
  }, [messages, currentTypingMessage]);

  useEffect(() => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (!isNearBottom) {
        setUserScrolled(true);
        setShouldAutoScroll(false);
      } else if (isNearBottom && userScrolled) {
        setShouldAutoScroll(true);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [userScrolled]);

  useEffect(() => {
    setUserScrolled(false);
    setShouldAutoScroll(true);
    
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, [messages.length === 0]);

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
              content={msg.is_ai && msg.id === currentTypingMessage ? typingContent : msg.content}
              isAi={msg.is_ai}
              createdAt={msg.created_at}
            />
            {!msg.is_ai && <MessageAvatar isAi={false} />}
          </div>
        ))}
        {isLoading && (
          <TypingIndicator 
            imageUrl={selectedPhilosopher?.profile_image_url}
            name={selectedPhilosopher?.name}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
