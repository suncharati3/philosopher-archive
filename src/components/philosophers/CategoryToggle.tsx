import { Button } from "@/components/ui/button";
import { Category } from "@/store/usePhilosophersStore";

interface CategoryToggleProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CategoryToggle = ({ selectedCategory, onCategoryChange }: CategoryToggleProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => onCategoryChange("all")}
      >
        All
      </Button>
      <Button
        variant={selectedCategory === "philosophers" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => onCategoryChange("philosophers")}
      >
        Philosophers
      </Button>
      <Button
        variant={selectedCategory === "religious" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => onCategoryChange("religious")}
      >
        Religious
      </Button>
    </div>
  );
};

export default CategoryToggle;