import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_ai ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.is_ai
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;