import { ScrollArea } from "@/components/ui/scroll-area";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import Message from "./Message";
import LoadingMessage from "./LoadingMessage";

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

  return (
    <ScrollArea className="flex-1 p-4 bg-chat-gradient">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="hover:bg-muted/10 rounded-3xl p-2 transition-colors">
            <Message
              content={msg.content}
              is_ai={msg.is_ai}
              created_at={msg.created_at}
              philosopherImage={selectedPhilosopher?.profile_image_url}
              philosopherName={selectedPhilosopher?.name}
            />
          </div>
        ))}
        {isLoading && (
          <div className="hover:bg-muted/10 rounded-3xl p-2 transition-colors">
            <LoadingMessage
              philosopherImage={selectedPhilosopher?.profile_image_url}
              philosopherName={selectedPhilosopher?.name}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;