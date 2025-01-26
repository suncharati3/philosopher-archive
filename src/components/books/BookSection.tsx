import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface BookSectionProps {
  title: string;
  content: string | null;
  type?: "text" | "tags";
}

const BookSection = ({ title, content, type = "text" }: BookSectionProps) => {
  if (!content) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">{title}</h3>
        {type === "tags" ? (
          <div className="flex flex-wrap gap-2">
            {content.split(",").map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{content}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BookSection;