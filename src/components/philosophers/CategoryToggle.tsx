import { GraduationCap, Church } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

interface CategoryToggleProps {
  selectedCategory: "all" | "philosophers" | "religious";
  onCategoryChange: (value: "all" | "philosophers" | "religious") => void;
  showLastConversation?: boolean;
  onShowLastConversationChange?: (value: boolean) => void;
  variant?: "sidebar" | "grid";
}

const CategoryToggle = ({
  selectedCategory,
  onCategoryChange,
  showLastConversation = false,
  onShowLastConversationChange,
  variant = "sidebar",
}: CategoryToggleProps) => {
  const handleValueChange = (value: string | undefined) => {
    // If clicking the same category or no value, reset to 'all'
    if (!value || value === selectedCategory) {
      onCategoryChange("all");
    } else {
      onCategoryChange(value as "philosophers" | "religious");
    }
  };

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
      {/* {onShowLastConversationChange && (
        <div className="flex items-center space-x-2">
          <Switch
            id="show-conversations"
            checked={showLastConversation}
            onCheckedChange={onShowLastConversationChange}
          />
          <Label htmlFor="show-conversations">Show Last Conversation</Label>
        </div>
      )} */}
    </div>
  );
};

export default CategoryToggle;
