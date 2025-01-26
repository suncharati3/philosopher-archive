import { Star } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";

interface PhilosopherIdeasProps {
  concepts: string[];
  keyIdeas: { title: string; description: string }[];
}

const PhilosopherIdeas = ({ concepts, keyIdeas }: PhilosopherIdeasProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {concepts.map((concept, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="px-4 py-2 text-base bg-primary/5 text-primary border-primary/20"
          >
            {concept}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {keyIdeas.map((idea, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
              <h4 className="font-semibold text-lg text-primary mb-3">{idea.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhilosopherIdeas;