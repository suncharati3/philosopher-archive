import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhilosopherSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PhilosopherSearch = ({ searchQuery, onSearchChange }: PhilosopherSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
      <Input
        placeholder="Search thinkers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 h-10 bg-primary/5 border-primary/20 placeholder:text-primary/40 focus-visible:ring-primary/30"
      />
    </div>
  );
};

export default PhilosopherSearch;