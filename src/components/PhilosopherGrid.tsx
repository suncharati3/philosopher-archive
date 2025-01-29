import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import { Button } from "./ui/button";
import { BookOpen, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PhilosopherGrid = () => {
  const { 
    philosophers, 
    setSelectedPhilosopher, 
    selectedCategory,
    searchQuery 
  } = usePhilosophersStore();
  const navigate = useNavigate();

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery,
    selectedCategory
  });

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-[2000px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {selectedCategory === 'all' && "All Thinkers"}
            {selectedCategory === 'philosophers' && "Philosophers"}
            {selectedCategory === 'religious' && "Religious Figures"}
          </h1>
          <div className="flex gap-3">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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