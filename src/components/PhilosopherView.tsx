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
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border p-3 md:p-4">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">{selectedPhilosopher.name}</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {selectedPhilosopher.nationality} • {selectedPhilosopher.era}
            </p>
          </div>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => onViewChange("chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-8rem)]">
        {view === "info" ? (
          <div className="p-3 md:p-6 space-y-6 md:space-y-8">
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

            <Tabs defaultValue="ideas" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-10 md:h-12 bg-transparent overflow-x-auto">
                <TabsTrigger 
                  value="ideas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none min-w-[120px]"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap">Core Ideas</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="quotes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none min-w-[120px]"
                >
                  <Quote className="mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap">Quotes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none min-w-[120px]"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap">Historical Context</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ideas" className="mt-4 md:mt-6">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-sm md:text-base text-muted-foreground">{selectedPhilosopher.core_ideas}</p>
                </div>
              </TabsContent>

              <TabsContent value="quotes" className="mt-4 md:mt-6">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {quotes.map((quote, index) => (
                      <CarouselItem key={index}>
                        <Card>
                          <CardContent className="flex aspect-[3/1] items-center justify-center p-4 md:p-6">
                            <blockquote className="text-base md:text-xl italic text-muted-foreground">
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

              <TabsContent value="history" className="mt-4 md:mt-6">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-sm md:text-base text-muted-foreground">
                    {selectedPhilosopher.historical_context}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold">Influences</h2>
              <div className="rounded-lg border bg-card p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground">{selectedPhilosopher.influences}</p>
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