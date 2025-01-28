import { useState } from "react";
import PhilosopherCard from "./philosophers/PhilosopherCard";
import PhilosopherSearch from "./philosophers/PhilosopherSearch";
import CategoryToggle from "./philosophers/CategoryToggle";
import UserMenu from "./philosophers/UserMenu";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

const PhilosopherGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { philosophers } = usePhilosophersStore();

  const filteredPhilosophers = philosophers.filter((philosopher) => {
    const matchesSearch = philosopher.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || philosopher.era === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PhilosopherSearch value={searchQuery} onChange={setSearchQuery} />
          <CategoryToggle value={selectedCategory} onChange={setSelectedCategory} />
        </div>
        <UserMenu />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhilosophers.map((philosopher) => (
          <PhilosopherCard key={philosopher.id} philosopher={philosopher} />
        ))}
      </div>
    </div>
  );
};

export default PhilosopherGrid;