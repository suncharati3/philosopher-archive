import { Card } from "./ui/card";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Users } from "lucide-react";

const PhilosopherGrid = () => {
  const { philosophers, setSelectedPhilosopher } = usePhilosophersStore();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Philosophers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {philosophers.map((philosopher) => (
          <Card 
            key={philosopher.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPhilosopher(philosopher)}
          >
            <div className="aspect-square bg-burgundy/5 flex items-center justify-center">
              {philosopher.profile_image_url ? (
                <img 
                  src={philosopher.profile_image_url} 
                  alt={philosopher.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
              )}
            </div>
            <div className="p-3 md:p-4">
              <h3 className="font-bold text-base md:text-lg mb-1">{philosopher.name}</h3>
              <div className="text-xs md:text-sm text-muted-foreground">
                <span>{philosopher.era}</span>
                {philosopher.nationality && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{philosopher.nationality}</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhilosopherGrid;