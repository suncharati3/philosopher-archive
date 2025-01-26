import { BookOpen, Book, Quote, Star, Award, AlertTriangle, History } from "lucide-react";
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
  const quotes = philosopher.quotes?.split('\n') || [];
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()) || [];
  const keyIdeas = philosopher.key_ideas?.split('\n') || [];
  const influences = philosopher.influences?.split('\n') || [];
  const controversies = philosopher.controversies?.split('\n') || [];

  return (
    <div className="space-y-6">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-muted-foreground">{philosopher.short_description}</p>
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

        <TabsContent value="ideas" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {concepts.map((concept, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20"
                >
                  {concept}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              {keyIdeas.map((idea, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">{idea}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="works" className="mt-6">
          <div className="space-y-4">
            {philosopher.major_works?.split('\n').map((work, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{work}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6">
          <Carousel>
            <CarouselContent>
              {quotes.map((quote, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-[3/1] items-center justify-center p-6">
                      <blockquote className="text-lg italic text-muted-foreground">
                        "{quote.trim()}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </TabsContent>

        <TabsContent value="legacy" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Influences
            </h3>
            {influences.map((influence, index) => (
              <p key={index} className="text-sm text-muted-foreground">{influence}</p>
            ))}
          </div>

          {controversies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Controversies
              </h3>
              {controversies.map((controversy, index) => (
                <p key={index} className="text-sm text-muted-foreground">{controversy}</p>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosopherDetailTabs;