import { Button } from "./ui/button";
import { MessageSquare, BookOpen, Quote, History, Star, Award, AlertTriangle, User, Book, Brain } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import ChatInterface from "./ChatInterface";

interface PhilosopherViewProps {
  view: "info" | "chat";
  onViewChange: (view: "info" | "chat") => void;
}

const PhilosopherView = ({ view, onViewChange }: PhilosopherViewProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  if (!selectedPhilosopher) return null;

  const quotes = selectedPhilosopher.quotes?.split('\n') || [];
  const concepts = selectedPhilosopher.core_ideas?.split(',').map(concept => concept.trim()) || [];
  const keyIdeas = selectedPhilosopher.key_ideas?.split('\n') || [];
  const controversies = selectedPhilosopher.controversies?.split('\n') || [];
  const influences = selectedPhilosopher.influences?.split('\n') || [];

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{selectedPhilosopher.name}</h1>
            <p className="text-sm text-muted-foreground">
              {selectedPhilosopher.nationality} • {selectedPhilosopher.era}
            </p>
          </div>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with {selectedPhilosopher.name}
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-8rem)] overflow-auto">
        {view === "info" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Image Carousel and Quick Info */}
            <div className="space-y-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {[selectedPhilosopher.profile_image_url].map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={selectedPhilosopher.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Full Name</div>
                      <div>{selectedPhilosopher.full_name || selectedPhilosopher.name}</div>
                      <div className="text-muted-foreground">Lifespan</div>
                      <div>{selectedPhilosopher.lifespan}</div>
                      <div className="text-muted-foreground">Nationality</div>
                      <div>{selectedPhilosopher.nationality}</div>
                      <div className="text-muted-foreground">Era</div>
                      <div>{selectedPhilosopher.era}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Framework & Style
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedPhilosopher.framework}</p>
                    <p className="text-sm text-muted-foreground">{selectedPhilosopher.style}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Personality</h3>
                    <p className="text-sm text-muted-foreground">{selectedPhilosopher.personality}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tabs with Detailed Information */}
            <div className="space-y-6">
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-muted-foreground">{selectedPhilosopher.short_description}</p>
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
                    {selectedPhilosopher.major_works?.split('\n').map((work, index) => (
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
          </div>
        ) : (
          <ChatInterface />
        )}
      </div>
    </div>
  );
};

export default PhilosopherView;