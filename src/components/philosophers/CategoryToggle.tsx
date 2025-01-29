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
        variant={selectedCategory === "favorites" ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={() => onCategoryChange("favorites")}
      >
        Favorites
      </Button>
    </div>
  );
};

export default CategoryToggle;