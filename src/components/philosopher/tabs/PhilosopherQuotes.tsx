import { Quote } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../ui/carousel";

interface PhilosopherQuotesProps {
  quotes: string[];
}

const PhilosopherQuotes = ({ quotes }: PhilosopherQuotesProps) => {
  return (
    <Carousel className="w-full">
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
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default PhilosopherQuotes;