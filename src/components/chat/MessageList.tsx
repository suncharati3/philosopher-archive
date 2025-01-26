import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { User } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

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
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.is_ai ? "justify-start" : "justify-end"
            }`}
          >
            {msg.is_ai && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={selectedPhilosopher?.profile_image_url}
                  alt={selectedPhilosopher?.name}
                />
                <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`group relative max-w-[80%] rounded-2xl p-4 ${
                msg.is_ai
                  ? "bg-gradient-to-br from-muted to-card border border-border/50"
                  : "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-lg"
              }`}
            >
              <p className="text-sm md:text-base">{msg.content}</p>
              <span
                className={`mt-1 block text-xs ${
                  msg.is_ai ? "text-muted-foreground" : "text-primary-foreground/80"
                }`}
              >
                {format(new Date(msg.created_at), "h:mm a")}
              </span>
            </div>
            {!msg.is_ai && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={selectedPhilosopher?.profile_image_url}
                alt={selectedPhilosopher?.name}
              />
              <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-gradient-to-br from-muted to-card border border-border/50 rounded-2xl p-4 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;