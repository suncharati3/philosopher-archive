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
      <div className="aspect-[3/4] relative group">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/80 via-accent to-secondary flex items-center justify-center p-6 transition-all duration-300 group-hover:scale-105">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2 font-playfair">
                {title}
              </h3>
              {authorName && (
                <p className="text-sm text-white/90 font-medium">
                  by {authorName}
                </p>
              )}
            </div>
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