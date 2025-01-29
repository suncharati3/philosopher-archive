import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhilosopherCardImageProps {
  imageUrl?: string;
  name: string;
  likes: number;
  interactions: number;
  onLike: (e: React.MouseEvent) => Promise<void>;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const PhilosopherCardImage = ({ 
  imageUrl, 
  name, 
  likes, 
  interactions, 
  onLike,
  onImageError 
}: PhilosopherCardImageProps) => {
  return (
    <div className="aspect-[4/3] bg-primary/5 overflow-hidden relative">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover object-[50%_30%]"
          onError={onImageError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Users className="w-16 h-16 text-muted-foreground/40" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-white/20"
              onClick={onLike}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {likes}
            </Button>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {interactions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherCardImage;