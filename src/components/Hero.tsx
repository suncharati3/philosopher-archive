import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const Hero = () => {
  const [searchInput, setSearchInput] = useState('');
  const setSearchQuery = usePhilosophersStore((state) => state.setSearchQuery);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center bg-burgundy text-ivory px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-20"/>
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8 animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-bold">Philosophical Wisdom</h1>
        <p className="text-xl md:text-2xl">Explore the great minds that shaped human thought</p>
        <div className="relative max-w-xl mx-auto">
          <Input 
            type="search" 
            placeholder="Search philosophers..." 
            className="w-full pl-12 h-12 bg-white/10 border-white/20 text-ivory placeholder:text-ivory/60"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/60" />
        </div>
      </div>
    </div>
  );
};

export default Hero;