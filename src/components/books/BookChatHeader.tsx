import { Book } from "lucide-react";
import { Button } from "../ui/button";

interface BookChatHeaderProps {
  title: string;
  coverImageUrl: string | null;
  onBack: () => void;
}

const BookChatHeader = ({ title, coverImageUrl, onBack }: BookChatHeaderProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button variant="ghost" onClick={onBack} className="mb-0">
        ← Back to Book Details
      </Button>
      <div className="flex items-center gap-2">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="h-10 w-8 object-cover rounded"
          />
        ) : (
          <Book className="h-10 w-8 text-muted-foreground" />
        )}
        <h3 className="font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default BookChatHeader;