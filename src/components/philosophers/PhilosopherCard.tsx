import { Users, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Philosopher } from "@/store/usePhilosophersStore";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  onClick: (philosopher: Philosopher) => void;
}

const PhilosopherCard = ({ philosopher, onClick }: PhilosopherCardProps) => {
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()).slice(0, 3) || [];

  return (
    <Card 
      key={philosopher.id}
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 cursor-pointer bg-background"
      onClick={() => onClick(philosopher)}
    >
      <div className="aspect-[4/3] bg-primary/5 overflow-hidden">
        {philosopher.profile_image_url ? (
          <img 
            src={philosopher.profile_image_url} 
            alt={philosopher.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-bold text-xl text-primary">{philosopher.name}</h3>
        <div className="flex flex-wrap gap-2">
          {philosopher.era && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {philosopher.era}
            </Badge>
          )}
          {philosopher.nationality && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {philosopher.nationality}
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
        {philosopher.core_ideas && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
            <p className="line-clamp-2">{philosopher.core_ideas}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PhilosopherCard;