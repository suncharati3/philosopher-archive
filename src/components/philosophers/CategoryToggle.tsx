import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Flame, History, Users } from "lucide-react";

interface CategoryToggleProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryToggle = ({
  selectedCategory,
  onCategoryChange,
}: CategoryToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={selectedCategory}
      onValueChange={(value) => {
        if (value) onCategoryChange(value);
      }}
      className="justify-start"
    >
      <ToggleGroupItem value="popular" aria-label="Toggle popular">
        <Flame className="h-4 w-4 mr-2" />
        Popular
      </ToggleGroupItem>
      <ToggleGroupItem value="era" aria-label="Toggle era">
        <History className="h-4 w-4 mr-2" />
        By Era
      </ToggleGroupItem>
      <ToggleGroupItem value="all" aria-label="Toggle all">
        <Users className="h-4 w-4 mr-2" />
        All
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CategoryToggle;