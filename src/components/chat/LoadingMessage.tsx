import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LoadingMessageProps {
  philosopherImage?: string;
  philosopherName?: string;
}

const LoadingMessage = ({ philosopherImage, philosopherName }: LoadingMessageProps) => {
  return (
    <div className="flex items-end gap-2 justify-start animate-fadeIn">
      <Avatar className="h-8 w-8">
        <AvatarImage src={philosopherImage} alt={philosopherName} />
        <AvatarFallback>{philosopherName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="bg-white/90 backdrop-blur-sm border border-border/50 rounded-2xl p-4 max-w-[80%] shadow-md">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;