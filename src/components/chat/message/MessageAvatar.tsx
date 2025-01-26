import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface MessageAvatarProps {
  isAi: boolean;
  imageUrl?: string;
  name?: string;
}

const MessageAvatar = ({ isAi, imageUrl, name }: MessageAvatarProps) => {
  if (isAi) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{name?.[0]}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};

export default MessageAvatar;