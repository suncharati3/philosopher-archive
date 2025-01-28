import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Concept {
  philosopher_name: string;
  concept: string;
  description: string;
}

const Ideas = () => {
  const { data: concepts, isLoading } = useQuery({
    queryKey: ['concepts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('philosophers')
        .select(`
          name,
          core_ideas,
          key_ideas
        `)
        .order('name');

      if (error) throw error;

      const processedConcepts: Concept[] = [];
      
      data.forEach(philosopher => {
        // Process core ideas
        if (philosopher.core_ideas) {
          const coreIdeas = philosopher.core_ideas.split(',').map(idea => idea.trim());
          coreIdeas.forEach(concept => {
            processedConcepts.push({
              philosopher_name: philosopher.name,
              concept: concept,
              description: "Core concept in the philosopher's work"
            });
          });
        }

        // Process key ideas
        if (philosopher.key_ideas) {
          try {
            const keyIdeas = JSON.parse(philosopher.key_ideas);
            if (Array.isArray(keyIdeas)) {
              keyIdeas.forEach(idea => {
                if (typeof idea === 'object' && idea.title) {
                  processedConcepts.push({
                    philosopher_name: philosopher.name,
                    concept: idea.title,
                    description: idea.description || "Key concept in the philosopher's work"
                  });
                }
              });
            }
          } catch (e) {
            console.error('Error parsing key_ideas for', philosopher.name, e);
          }
        }
      });

      return processedConcepts;
    }
  });

  const groupedConcepts = concepts?.reduce((acc, concept) => {
    if (!acc[concept.philosopher_name]) {
      acc[concept.philosopher_name] = [];
    }
    acc[concept.philosopher_name].push(concept);
    return acc;
  }, {} as Record<string, Concept[]>);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Ideas & Concepts</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Ideas & Concepts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupedConcepts && Object.entries(groupedConcepts).map(([philosopher, concepts]) => (
          <Card key={philosopher} className="overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <h2 className="text-xl font-semibold text-primary">{philosopher}</h2>
              <p className="text-sm text-muted-foreground">
                {concepts.length} concept{concepts.length !== 1 ? 's' : ''}
              </p>
            </CardHeader>
            <ScrollArea className="h-[300px]">
              <CardContent className="p-4 space-y-4">
                {concepts.map((concept, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-primary/80">{concept.concept}</h3>
                    <p className="text-sm text-muted-foreground">{concept.description}</p>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Ideas;