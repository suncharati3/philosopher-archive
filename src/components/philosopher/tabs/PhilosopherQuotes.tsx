import { Quote } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../ui/carousel";
import { useState, useEffect } from "react";
import type { CarouselApi } from "../../ui/carousel";

interface PhilosopherQuotesProps {
  quotes: string[];
}

const PhilosopherQuotes = ({ quotes }: PhilosopherQuotesProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalQuotes = quotes.length;
  const [api, setApi] = useState<CarouselApi>();

  // Update current index when carousel scrolls
  const onSelect = () => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap() + 1);
  };

  // Subscribe to carousel events
  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Quote {currentIndex} of {totalQuotes}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Swipe to navigate</span>
        </div>
      </div>

      <Carousel 
        className="w-full"
        opts={{
          align: "start",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {quotes.map((quote, index) => (
            <CarouselItem key={index}>
              <Card className="border-none shadow-md">
                <CardContent className="flex aspect-[3/1] items-center justify-center p-12 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <Quote className="h-12 w-12 text-primary mx-auto opacity-50" />
                    <blockquote className="text-xl italic text-foreground leading-relaxed">
                      "{quote.trim()}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-12 hover:bg-primary/5 hover:border-primary/20" />
        <CarouselNext className="hidden sm:flex -right-12 hover:bg-primary/5 hover:border-primary/20" />
      </Carousel>
    </div>
  );
};

export default PhilosopherQuotes;