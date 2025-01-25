import { Card } from "./ui/card";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Users, Book } from "lucide-react";
import { Badge } from "./ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PhilosopherGrid = () => {
  const { 
    philosophers, 
    setSelectedPhilosopher, 
    selectedCategory,
    setSelectedCategory,
    searchQuery 
  } = usePhilosophersStore();

  const filteredPhilosophers = philosophers.filter((philosopher) => {
    const matchesSearch = !searchQuery || 
      philosopher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      philosopher.nationality?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'philosophers' && !philosopher.is_religious) ||
      (selectedCategory === 'religious' && philosopher.is_religious);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {selectedCategory === 'all' && "All Thinkers"}
            {selectedCategory === 'philosophers' && "Philosophers"}
            {selectedCategory === 'religious' && "Religious Figures"}
          </h1>
          <ToggleGroup 
            type="single" 
            value={selectedCategory} 
            onValueChange={(value) => value && setSelectedCategory(value as 'all' | 'philosophers' | 'religious')}
            className="flex gap-2"
          >
            <ToggleGroupItem value="philosophers" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">Philosophers</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="religious" className="flex items-center gap-2">
              <Book className="w-4 h-4 rotate-180" />
              <span className="hidden sm:inline">Religious</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPhilosophers.map((philosopher) => (
            <Card 
              key={philosopher.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 cursor-pointer bg-background"
              onClick={() => setSelectedPhilosopher(philosopher)}
            >
              <div className="aspect-[4/3] bg-primary/5 overflow-hidden">
                {philosopher.profile_image_url ? (
                  <img 
                    src={philosopher.profile_image_url} 
                    alt={philosopher.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-xl text-primary">{philosopher.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {philosopher.era && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {philosopher.era}
                    </Badge>
                  )}
                  {philosopher.nationality && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {philosopher.nationality}
                    </Badge>
                  )}
                </div>
                {philosopher.core_ideas && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {philosopher.core_ideas}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhilosopherGrid;