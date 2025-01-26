import { Book } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryToggleProps {
  selectedCategory: 'all' | 'philosophers' | 'religious';
  onCategoryChange: (value: 'all' | 'philosophers' | 'religious') => void;
  variant?: 'sidebar' | 'grid';
}

const CategoryToggle = ({ selectedCategory, onCategoryChange, variant = 'sidebar' }: CategoryToggleProps) => {
  const handleValueChange = (value: string | undefined) => {
    // If clicking the same category or no value, reset to 'all'
    if (!value || value === selectedCategory) {
      onCategoryChange('all');
    } else {
      onCategoryChange(value as 'philosophers' | 'religious');
    }
  };

  return (
    <ToggleGroup 
      type="single" 
      value={selectedCategory === 'all' ? undefined : selectedCategory}
      onValueChange={handleValueChange}
      className="w-full flex gap-2"
    >
      <ToggleGroupItem value="philosophers" className="flex items-center gap-2">
        <Book className="w-4 h-4" />
        <span>Philosophers</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="religious" className="flex items-center gap-2">
        <Book className="w-4 h-4 rotate-180" />
        <span>Religious</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CategoryToggle;