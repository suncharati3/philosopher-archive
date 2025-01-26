import CategoryToggle from "./CategoryToggle";
import PhilosopherSearch from "./PhilosopherSearch";
import { SidebarHeader } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  showLastConversation: boolean;
  onShowLastConversationChange: (show: boolean) => void;
}

const PhilosopherSidebarHeader = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showLastConversation,
  onShowLastConversationChange,
}: SidebarHeaderProps) => {
  return (
    <SidebarHeader className="border-b border-border/40 p-4 space-y-4">
      <CategoryToggle 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        showLastConversation={showLastConversation}
        onShowLastConversationChange={onShowLastConversationChange}
      />
      <PhilosopherSearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </SidebarHeader>
  );
};

export default PhilosopherSidebarHeader;