import { Book } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryToggleProps {
  selectedCategory: 'all' | 'philosophers' | 'religious';
  onCategoryChange: (value: 'all' | 'philosophers' | 'religious') => void;
  variant?: 'sidebar' | 'grid';
}

const CategoryToggle = ({ selectedCategory, onCategoryChange, variant = 'sidebar' }: CategoryToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={selectedCategory} 
      onValueChange={(value) => value && onCategoryChange(value as 'all' | 'philosophers' | 'religious')}
      className={variant === 'sidebar' ? "w-full grid grid-cols-2 gap-2" : "flex gap-2"}
    >
      <ToggleGroupItem value="philosophers" className="flex items-center gap-2">
        <Book className="w-4 h-4" />
        <span className={variant === 'grid' ? "hidden sm:inline" : undefined}>Philosophers</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="religious" className="flex items-center gap-2">
        <Book className="w-4 h-4 rotate-180" />
        <span className={variant === 'grid' ? "hidden sm:inline" : undefined}>Religious</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CategoryToggle;