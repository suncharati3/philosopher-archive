import { User, Brain } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface PhilosopherQuickInfoProps {
  philosopher: {
    profile_image_url: string;
    name: string;
    full_name: string;
    lifespan: string;
    nationality: string;
    era: string;
    framework: string;
    style: string;
    personality: string;
  };
}

const PhilosopherQuickInfo = ({ philosopher }: PhilosopherQuickInfoProps) => {
  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={philosopher.profile_image_url}
                alt={philosopher.name}
                className="h-full w-full object-cover"
              />
            </div>
          </CarouselItem>
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
              <div>{philosopher.full_name || philosopher.name}</div>
              <div className="text-muted-foreground">Lifespan</div>
              <div>{philosopher.lifespan}</div>
              <div className="text-muted-foreground">Nationality</div>
              <div>{philosopher.nationality}</div>
              <div className="text-muted-foreground">Era</div>
              <div>{philosopher.era}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Framework & Style
            </h3>
            <p className="text-sm text-muted-foreground">{philosopher.framework}</p>
            <p className="text-sm text-muted-foreground">{philosopher.style}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Personality</h3>
            <p className="text-sm text-muted-foreground">{philosopher.personality}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhilosopherQuickInfo;