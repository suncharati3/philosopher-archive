import { Book } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    publication_date: string | null;
    summary: string | null;
    cover_image_url: string | null;
  };
  onClick: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-primary/5">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">{book.title}</h3>
        {book.publication_date && (
          <p className="text-sm text-muted-foreground">
            Published: {book.publication_date}
          </p>
        )}
        {book.summary && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {book.summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;