import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import CategoryToggle from "./philosophers/CategoryToggle";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import { filterPhilosophers } from "@/utils/philosopher-utils";

const PhilosopherGrid = () => {
  const { 
    philosophers, 
    setSelectedPhilosopher, 
    selectedCategory,
    setSelectedCategory,
    searchQuery 
  } = usePhilosophersStore();

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery,
    selectedCategory
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
          <CategoryToggle 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            variant="grid"
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