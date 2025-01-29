import { Upload } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import PhilosopherImageUpload from "../philosophers/PhilosopherImageUpload";

interface PhilosopherImageCarouselProps {
  philosopherId: number;
  name: string;
  imageUrl?: string;
  isAdmin?: boolean;
  onUploadComplete: (newUrl: string) => void;
}

const PhilosopherImageCarousel = ({
  philosopherId,
  name,
  imageUrl,
  isAdmin,
  onUploadComplete
}: PhilosopherImageCarouselProps) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <div className="aspect-[4/3] overflow-hidden rounded-lg relative group">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="h-full w-full object-cover object-[50%_30%]"
            />
            {isAdmin && (
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <PhilosopherImageUpload
                  philosopherId={philosopherId}
                  onUploadComplete={onUploadComplete}
                />
              </div>
            )}
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default PhilosopherImageCarousel;