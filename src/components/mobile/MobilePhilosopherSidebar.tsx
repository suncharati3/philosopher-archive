import { useState, useEffect } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import CategoryToggle from "../philosophers/CategoryToggle";
import PhilosopherSearch from "../philosophers/PhilosopherSearch";
import PhilosopherList from "../philosophers/PhilosopherList";
import UserMenu from "../philosophers/UserMenu";
import { TokenBalanceDisplay } from "../tokens/TokenBalanceDisplay";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import { Separator } from "../ui/separator";

interface MobilePhilosopherSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobilePhilosopherSidebar = ({ isOpen, setIsOpen }: MobilePhilosopherSidebarProps) => {
  const isMobile = useIsMobile();
  
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
    setIsOpen(false); // Close sidebar after selection on mobile
  };

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 p-0 bg-background border-r border-border/40 z-50"
      >
        <SheetHeader className="border-b border-border/40 p-4 bg-background">
          <SheetTitle>Philosophers</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full bg-background">
          <div className="p-4 space-y-4 border-b border-border/40 bg-background">
            <CategoryToggle 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <PhilosopherSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          <div className="flex-1 overflow-auto bg-background">
            <PhilosopherList 
              philosophers={filteredPhilosophers}
              selectedPhilosopher={selectedPhilosopher}
              onPhilosopherSelect={handlePhilosopherSelect}
            />
          </div>
          
          <div className="border-t border-border/40 p-4 space-y-4 bg-background">
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