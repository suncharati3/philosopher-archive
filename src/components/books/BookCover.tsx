import { Book } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface BookCoverProps {
  title: string;
  coverImageUrl: string | null;
  publicationDate: string | null;
  authorName?: string | null;
}

const BookCover = ({ title, coverImageUrl, publicationDate, authorName }: BookCoverProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] bg-primary/5">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-24 h-24 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {authorName && (
          <p className="text-lg font-medium text-primary mb-2">
            By {authorName}
          </p>
        )}
        {publicationDate && (
          <p className="text-sm text-muted-foreground">
            Published: {publicationDate}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCover;