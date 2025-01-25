import { useEffect } from "react";
import { Search, Users, Settings, User } from "lucide-react";
import { Input } from "./ui/input";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const PhilosopherSidebar = () => {
  const { 
    philosophers, 
    fetchPhilosophers, 
    searchQuery, 
    setSearchQuery,
    selectedPhilosopher,
    setSelectedPhilosopher 
  } = usePhilosophersStore();
  const { user, signOut } = useAuth();
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
    <Sidebar className="border-r border-border/40 bg-white">
      <SidebarHeader className="border-b border-border/40 p-3 md:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-burgundy/60" />
          <Input
            placeholder="Search philosophers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-burgundy/5 border-burgundy/20 placeholder:text-burgundy/40 focus-visible:ring-burgundy/30"
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
                className={`min-h-[48px] transition-colors ${
                  selectedPhilosopher?.id === philosopher.id 
                    ? 'bg-burgundy/10 text-burgundy'
                    : 'hover:bg-burgundy/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full flex-shrink-0 bg-burgundy/5">
                    {philosopher.profile_image_url ? (
                      <img
                        src={philosopher.profile_image_url}
                        alt={philosopher.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-burgundy/40" />
                      </div>
                    )}
                  </div>
                  <span className="truncate font-medium">{philosopher.name}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-burgundy/5">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-burgundy/5 text-burgundy">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-left">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PhilosopherSidebar;