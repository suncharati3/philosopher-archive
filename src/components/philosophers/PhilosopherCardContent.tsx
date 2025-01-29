import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PhilosopherCardContentProps {
  name: string;
  era?: string;
  nationality?: string;
  concepts: string[];
  coreIdeas?: string;
}

const PhilosopherCardContent = ({
  name,
  era,
  nationality,
  concepts,
  coreIdeas
}: PhilosopherCardContentProps) => {
  return (
    <div className="p-5 space-y-3">
      <h3 className="font-bold text-xl text-primary">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {era && (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {era}
          </Badge>
        )}
        {nationality && (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {nationality}
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {concepts.map((concept, index) => (
          <Badge 
            key={index}
            variant="secondary" 
            className="text-xs"
          >
            {concept}
          </Badge>
        ))}
      </div>
      {coreIdeas && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="line-clamp-2">{coreIdeas}</p>
        </div>
      )}
    </div>
  );
};

export default PhilosopherCardContent;