import { Card, CardContent, CardHeader } from "./ui/card";

interface PhilosopherCardProps {
  name: string;
  era: string;
  nationality: string;
  coreIdeas: string;
  imageUrl: string;
}

const PhilosopherCard = ({ name, era, nationality, coreIdeas, imageUrl }: PhilosopherCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fadeIn">
      <div className="aspect-square overflow-hidden bg-burgundy/10">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="border-t border-border">
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{era}</span>
          <span>•</span>
          <span>{nationality}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{coreIdeas}</p>
      </CardContent>
    </Card>
  );
};

export default PhilosopherCard;