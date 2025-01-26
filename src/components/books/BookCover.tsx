import { Book } from "lucide-react";
import { Card, CardHeader } from "../ui/card";

interface BookCoverProps {
  title: string;
  coverImageUrl: string | null;
  publicationDate?: string | null;
}

const BookCover = ({ title, coverImageUrl, publicationDate }: BookCoverProps) => {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="aspect-[3/4] bg-primary/5 rounded-lg overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Book className="w-20 h-20 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {publicationDate && (
          <p className="text-muted-foreground">Published: {publicationDate}</p>
        )}
      </CardHeader>
    </Card>
  );
};

export default BookCover;