import { Book } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    publication_date: string | null;
    summary: string | null;
    cover_image_url: string | null;
  };
  onClick: () => void;
  isLoading?: boolean;
  isMajorWork?: boolean;
}

const BookCard = ({ book, onClick, isLoading, isMajorWork }: BookCardProps) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="aspect-[3/4] bg-muted rounded-t-lg">
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-16 h-16 text-muted-foreground/20" />
          </div>
        </div>
        <CardContent className="pt-6 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 group animate-fadeIn"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-primary/5 overflow-hidden rounded-t-lg">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          {isMajorWork && (
            <Badge variant="secondary" className="shrink-0">
              Major Work
            </Badge>
          )}
        </div>
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