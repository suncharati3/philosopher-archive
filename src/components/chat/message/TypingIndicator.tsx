import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  imageUrl?: string;
  name?: string;
}

const TypingIndicator = ({ imageUrl, name }: TypingIndicatorProps) => {
  return (
    <div className="flex items-end gap-2 justify-start animate-fadeIn">
      <Avatar className="h-8 w-8">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="bg-gradient-to-br from-muted to-card border border-border/50 rounded-2xl p-4 max-w-[80%]">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;