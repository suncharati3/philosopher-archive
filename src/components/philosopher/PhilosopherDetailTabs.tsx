import { BookOpen, Book, Quote, Star, Award, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface PhilosopherDetailTabsProps {
  philosopher: {
    short_description: string;
    core_ideas: string;
    key_ideas: string;
    major_works: string;
    quotes: string;
    influences: string;
    controversies: string;
  };
}

const PhilosopherDetailTabs = ({ philosopher }: PhilosopherDetailTabsProps) => {
  const quotes = philosopher.quotes?.split('\n').filter(Boolean) || [];
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()) || [];
  const keyIdeas = philosopher.key_ideas?.split(',').map(idea => {
    const [title, description] = idea.split(':').map(part => part.trim());
    return { title, description };
  }) || [];
  const influences = philosopher.influences?.split('\n') || [];
  const controversies = philosopher.controversies?.split('\n') || [];
  const majorWorks = philosopher.major_works?.split('\n').filter(Boolean) || [];

  return (
    <div className="space-y-8">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed">{philosopher.short_description}</p>
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent overflow-x-auto">
          <TabsTrigger value="ideas" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <BookOpen className="mr-2 h-4 w-4" />
            Key Ideas
          </TabsTrigger>
          <TabsTrigger value="works" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Book className="mr-2 h-4 w-4" />
            Major Works
          </TabsTrigger>
          <TabsTrigger value="quotes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Quote className="mr-2 h-4 w-4" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="legacy" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Star className="mr-2 h-4 w-4" />
            Legacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-8">
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
        </TabsContent>

        <TabsContent value="works" className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {majorWorks.map((work, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Book className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg leading-tight">{work}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="mt-8">
          <Carousel className="w-full">
            <CarouselContent>
              {quotes.map((quote, index) => (
                <CarouselItem key={index}>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex aspect-[3/1] items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <Quote className="h-10 w-10 text-primary mx-auto opacity-50" />
                        <blockquote className="text-xl italic text-foreground leading-relaxed">
                          "{quote.trim()}"
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </TabsContent>

        <TabsContent value="legacy" className="mt-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Influences
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {influences.map((influence, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                    <p className="text-foreground leading-relaxed">{influence}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {controversies.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Controversies
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {controversies.map((controversy, index) => (
                  <Card key={index} className="border-none shadow-md">
                    <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                      <p className="text-foreground leading-relaxed">{controversy}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosopherDetailTabs;