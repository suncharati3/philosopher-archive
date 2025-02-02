import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import PhilosopherFilters from "./philosophers/PhilosopherFilters";

const PhilosopherGrid = () => {
  const { 
    philosophers, 
    setSelectedPhilosopher, 
    selectedCategory,
    searchQuery 
  } = usePhilosophersStore();

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery,
    selectedCategory
  });

  // Extract unique eras and concepts for filters
  const eras = Array.from(new Set(philosophers.map(p => p.era).filter(Boolean)));
  const concepts = Array.from(new Set(
    philosophers
      .flatMap(p => p.core_ideas?.split(',').map(concept => concept.trim()))
      .filter(Boolean)
  ));

  const handleFilterChange = (type: string, value: string) => {
    // Filter handling logic will be implemented here
    console.log('Filter changed:', type, value);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {selectedCategory === 'all' && "All Thinkers"}
            {selectedCategory === 'philosophers' && "Philosophers"}
            {selectedCategory === 'religious' && "Religious Figures"}
          </h1>
          <PhilosopherFilters
            eras={eras}
            concepts={concepts}
            onFilterChange={handleFilterChange}
            activeFilters={{ era: [], concept: [] }}
          />
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