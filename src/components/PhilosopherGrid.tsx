import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import { Button } from "./ui/button";
import { BookOpen, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhilosopherFilters from "./philosophers/PhilosopherFilters";

const PhilosopherGrid = () => {
  const { 
    philosophers, 
    setSelectedPhilosopher, 
    selectedCategory,
    searchQuery 
  } = usePhilosophersStore();
  const navigate = useNavigate();

  // Extract unique eras and concepts from philosophers
  const eras = Array.from(new Set(philosophers
    .map(p => p.era)
    .filter(Boolean))) as string[];

  const concepts = Array.from(new Set(philosophers
    .flatMap(p => (p.core_ideas || "").split(",").map(idea => idea.trim()))
    .filter(Boolean))) as string[];

  const handleFilterChange = (type: string, value: string) => {
    // This is a placeholder for filter functionality
    console.log(`Filter changed: ${type} - ${value}`);
  };

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery,
    selectedCategory
  });

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {selectedCategory === 'all' && "All Thinkers"}
            {selectedCategory === 'philosophers' && "Philosophers"}
            {selectedCategory === 'religious' && "Religious Figures"}
          </h1>
          <div className="flex flex-wrap gap-3 items-center">
            <PhilosopherFilters
              eras={eras}
              concepts={concepts}
              onFilterChange={handleFilterChange}
              activeFilters={{ era: [], concept: [], timeline: [] }}
            />
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/books')}
            >
              <BookText className="w-4 h-4" />
              Books & Scripts
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/ideas')}
            >
              <BookOpen className="w-4 h-4" />
              Ideas & Concepts
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPhilosophers.map((philosopher) => (
            <PhilosopherCard
              key={philosopher.id}
              philosopher={philosopher}
              onClick={setSelectedPhilosopher}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhilosopherGrid;