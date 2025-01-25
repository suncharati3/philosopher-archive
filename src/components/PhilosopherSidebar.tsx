import { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

const PhilosopherSidebar = () => {
  const { 
    philosophers, 
    fetchPhilosophers, 
    searchQuery, 
    setSearchQuery,
    selectedPhilosopher,
    setSelectedPhilosopher 
  } = usePhilosophersStore();
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchPhilosophers();
  }, [fetchPhilosophers]);

  const filteredPhilosophers = philosophers.filter((philosopher) =>
    philosopher.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    philosopher.era?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    philosopher.nationality?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search philosophers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredPhilosophers.map((philosopher) => (
            <SidebarMenuItem key={philosopher.id}>
              <SidebarMenuButton
                onClick={() => setSelectedPhilosopher(philosopher)}
                isActive={selectedPhilosopher?.id === philosopher.id}
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 overflow-hidden rounded-full">
                    <img
                      src={philosopher.profile_image_url}
                      alt={philosopher.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>{philosopher.name}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default PhilosopherSidebar;