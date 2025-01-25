import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen, Quote, History } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import ChatInterface from "./ChatInterface";

interface PhilosopherViewProps {
  view: "info" | "chat";
  onViewChange: (view: "info" | "chat") => void;
}

const PhilosopherView = ({ view, onViewChange }: PhilosopherViewProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  if (!selectedPhilosopher) return null;

  const quotes = selectedPhilosopher.quotes?.split('\n') || [];

  return (
    <div className="h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h1 className="text-3xl font-bold">{selectedPhilosopher.name}</h1>
            <p className="text-muted-foreground">
              {selectedPhilosopher.nationality} • {selectedPhilosopher.era}
            </p>
          </div>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-8rem)]">
        {view === "info" ? (
          <div className="p-6 space-y-8">
            {/* Profile Image */}
            <div className="aspect-[2/1] overflow-hidden rounded-lg">
              <picture>
                <source
                  srcSet={selectedPhilosopher.profile_image_url}
                  type="image/webp"
                />
                <img
                  src={selectedPhilosopher.profile_image_url}
                  alt={selectedPhilosopher.name}
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="ideas" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent">
                <TabsTrigger 
                  value="ideas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Core Ideas
                </TabsTrigger>
                <TabsTrigger 
                  value="quotes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <Quote className="mr-2 h-4 w-4" />
                  Quotes
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <History className="mr-2 h-4 w-4" />
                  Historical Context
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ideas" className="mt-6">
                <div className="prose prose-stone dark:prose-invert">
                  <p className="text-muted-foreground">{selectedPhilosopher.core_ideas}</p>
                </div>
              </TabsContent>

              <TabsContent value="quotes" className="mt-6">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {quotes.map((quote, index) => (
                      <CarouselItem key={index}>
                        <Card>
                          <CardContent className="flex aspect-[3/1] items-center justify-center p-6">
                            <blockquote className="text-xl italic text-muted-foreground">
                              "{quote.trim()}"
                            </blockquote>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="prose prose-stone dark:prose-invert">
                  <p className="text-muted-foreground">
                    {selectedPhilosopher.historical_context}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Influences Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Influences</h2>
              <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">{selectedPhilosopher.influences}</p>
              </div>
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