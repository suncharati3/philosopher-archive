import { GraduationCap, Church } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CategoryToggleProps {
  selectedCategory: 'all' | 'philosophers' | 'religious';
  onCategoryChange: (value: 'all' | 'philosophers' | 'religious') => void;
  showLastConversation?: boolean;
  onShowLastConversationChange?: (value: boolean) => void;
  variant?: 'sidebar' | 'grid';
}

const CategoryToggle = ({ 
  selectedCategory, 
  onCategoryChange, 
  showLastConversation = false,
  onShowLastConversationChange,
  variant = 'sidebar' 
}: CategoryToggleProps) => {
  const handleValueChange = (value: string | undefined) => {
    // If clicking the same category or no value, reset to 'all'
    if (!value || value === selectedCategory) {
      onCategoryChange('all');
    } else {
      onCategoryChange(value as 'philosophers' | 'religious');
    }
  };

  return (
    <div className="space-y-4">
      <ToggleGroup 
        type="single" 
        value={selectedCategory === 'all' ? undefined : selectedCategory}
        onValueChange={handleValueChange}
        className="w-full flex gap-2"
      >
        <ToggleGroupItem value="philosophers" className="flex items-center gap-2 flex-1">
          <GraduationCap className="w-4 h-4" />
          <span>Philosophers</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="religious" className="flex items-center gap-2 flex-1">
          <Church className="w-4 h-4" />
          <span>Religious</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {onShowLastConversationChange && (
        <div className="flex items-center space-x-2">
          <Switch
            id="show-conversations"
            checked={showLastConversation}
            onCheckedChange={onShowLastConversationChange}
          />
          <Label htmlFor="show-conversations">Show Last Conversation</Label>
        </div>
      )}
    </div>
  );
};

export default CategoryToggle;