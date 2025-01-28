import { Quote, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../ui/carousel";
import { useEffect, useState } from "react";

interface PhilosopherQuotesProps {
  quotes: string[];
}

const PhilosopherQuotes = ({ quotes }: PhilosopherQuotesProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalQuotes = quotes.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Quote {currentIndex} of {totalQuotes}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronRight className="h-4 w-4 animate-pulse" />
          <span>Swipe or use arrows to navigate</span>
        </div>
      </div>

      <Carousel 
        className="w-full"
        onSelect={(index) => setCurrentIndex(index + 1)}
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