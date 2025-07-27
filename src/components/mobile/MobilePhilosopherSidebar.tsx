import { useEffect } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import CategoryToggle from "../philosophers/CategoryToggle";
import PhilosopherSearch from "../philosophers/PhilosopherSearch";
import PhilosopherList from "../philosophers/PhilosopherList";
import UserMenu from "../philosophers/UserMenu";
import { TokenBalanceDisplay } from "../tokens/TokenBalanceDisplay";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";

const MobilePhilosopherSidebar = () => {
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();
  
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

  const handlePhilosopherSelect = (philosopher: any) => {
    setSelectedPhilosopher(philosopher);
    setOpen(false); // Close sidebar after selection on mobile
  };

  return isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b border-border/40 p-4">
          <SheetTitle>Philosophers</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="p-4 space-y-4 border-b border-border/40">
            <CategoryToggle 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <PhilosopherSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          <div className="flex-1 overflow-auto">
            <PhilosopherList 
              philosophers={filteredPhilosophers}
              selectedPhilosopher={selectedPhilosopher}
              onPhilosopherSelect={handlePhilosopherSelect}
            />
          </div>
          
          <div className="border-t border-border/40 p-4 space-y-4">
            <TokenBalanceDisplay />
            <Separator />
            <UserMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ) : null;
};

export default MobilePhilosopherSidebar;