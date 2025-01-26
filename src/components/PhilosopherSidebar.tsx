import { useState } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Sidebar, SidebarContent } from "./ui/sidebar";
import PhilosopherList from "./philosophers/PhilosopherList";
import LastConversation from "./philosophers/LastConversation";
import PhilosopherSidebarHeader from "./philosophers/SidebarHeader";
import PhilosopherSidebarFooter from "./philosophers/SidebarFooter";
import { filterPhilosophers } from "@/utils/philosopher-utils";

const PhilosopherSidebar = () => {
  const { 
    philosophers, 
    fetchPhilosophers, 
    searchQuery, 
    setSearchQuery,
    selectedPhilosopher,
    setSelectedPhilosopher,
    selectedCategory,
    setSelectedCategory 
  } = usePhilosophersStore();
  
  const [showLastConversation, setShowLastConversation] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery: debouncedSearch,
    selectedCategory
  });

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      <PhilosopherSidebarHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory as "all" | "philosophers" | "religious"}
        onCategoryChange={setSelectedCategory}
        showLastConversation={showLastConversation}
        onShowLastConversationChange={setShowLastConversation}
      />
      <SidebarContent>
        <PhilosopherList 
          philosophers={filteredPhilosophers}
          selectedPhilosopher={selectedPhilosopher}
          onPhilosopherSelect={setSelectedPhilosopher}
        />
        <LastConversation showLastConversation={showLastConversation} />
      </SidebarContent>
      <PhilosopherSidebarFooter />
    </Sidebar>
  );
};

export default PhilosopherSidebar;