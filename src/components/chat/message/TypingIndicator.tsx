import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  imageUrl?: string;
  name?: string;
}

const TypingIndicator = ({ imageUrl, name }: TypingIndicatorProps) => {
  return (
    <div className="flex items-end gap-3 justify-start animate-fadeIn max-w-4xl mx-auto">
      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary">{name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="bg-gradient-to-br from-card/80 to-muted/60 border border-border/40 backdrop-blur-sm rounded-2xl p-5 max-w-[85%] shadow-sm">
        <div className="flex space-x-2 items-center">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <span className="text-xs text-muted-foreground ml-2 opacity-70">{name} is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;