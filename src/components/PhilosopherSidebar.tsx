import { useEffect } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import CategoryToggle from "./philosophers/CategoryToggle";
import PhilosopherSearch from "./philosophers/PhilosopherSearch";
import PhilosopherList from "./philosophers/PhilosopherList";
import UserMenu from "./philosophers/UserMenu";
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
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchPhilosophers();
  }, [fetchPhilosophers]);

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery: debouncedSearch,
    selectedCategory
  });

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      <SidebarHeader className="border-b border-border/40 p-4 space-y-4">
        <CategoryToggle 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <PhilosopherSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </SidebarHeader>
      <SidebarContent>
        <PhilosopherList 
          philosophers={filteredPhilosophers}
          selectedPhilosopher={selectedPhilosopher}
          onPhilosopherSelect={setSelectedPhilosopher}
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default PhilosopherSidebar;