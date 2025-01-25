import { Card } from "./ui/card";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Users } from "lucide-react";

const PhilosopherGrid = () => {
  const { philosophers, setSelectedPhilosopher } = usePhilosophersStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Philosophers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Users className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{philosopher.name}</h3>
              <div className="text-sm text-muted-foreground">
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