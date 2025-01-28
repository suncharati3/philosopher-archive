import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Lightbulb } from "lucide-react";
import Hero from "./Hero";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import PhilosopherList from "./philosophers/PhilosopherList";

const PhilosopherGrid = () => {
  const navigate = useNavigate();
  const { 
    philosophers,
    selectedPhilosopher,
    setSelectedPhilosopher,
    searchQuery 
  } = usePhilosophersStore();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end gap-2 p-4 absolute top-0 right-0 z-10">
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => navigate("/ideas")}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Ideas
        </Button>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => navigate("/books")}
        >
          <Book className="mr-2 h-4 w-4" />
          Books
        </Button>
      </div>
      <Hero />
      <div className="flex-1 container mx-auto p-6">
        <PhilosopherList 
          philosophers={philosophers}
          selectedPhilosopher={selectedPhilosopher}
          onPhilosopherSelect={setSelectedPhilosopher}
        />
      </div>
    </div>
  );
};

export default PhilosopherGrid;