import { ArrowLeft, Book } from "lucide-react";
import { Button } from "../ui/button";

interface BookChatHeaderProps {
  title: string;
  coverImageUrl: string | null;
  onBack: () => void;
}

const BookChatHeader = ({ title, coverImageUrl, onBack }: BookChatHeaderProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden bg-primary/5 flex items-center justify-center">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Book className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Discussion</p>
        </div>
      </div>
    </div>
  );
};

export default BookChatHeader;