import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import SuggestionsSection from "./suggestions/SuggestionsSection";

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

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:gap-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {selectedCategory === 'all' && "All Thinkers"}
          {selectedCategory === 'philosophers' && "Philosophers"}
          {selectedCategory === 'religious' && "Religious Figures"}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPhilosophers.map((philosopher) => (
            <PhilosopherCard
              key={philosopher.id}
              philosopher={philosopher}
              onClick={setSelectedPhilosopher}
            />
          ))}
        </div>

        <div className="mt-12 border-t pt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            Suggest New Content
          </h2>
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
};

export default PhilosopherGrid;