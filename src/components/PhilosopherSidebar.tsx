import { useEffect } from "react";
import { Search, Users, Settings, User } from "lucide-react";
import { Input } from "./ui/input";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "./ui/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchPhilosophers();
  }, [fetchPhilosophers]);

  const handleNavigate = (path: string) => {
    navigate(path);
    toast({
      title: "Navigation",
      description: `Navigating to ${path}...`,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPhilosophers = philosophers.filter((philosopher) =>
    philosopher.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    philosopher.era?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    philosopher.nationality?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <Sidebar className="border-r border-border/40 bg-white">
      <SidebarHeader className="border-b border-border/40 p-3 md:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
          <Input
            placeholder="Search philosophers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-primary/5 border-primary/20 placeholder:text-primary/40 focus-visible:ring-primary/30"
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
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full flex-shrink-0 bg-primary/5">
                    {philosopher.profile_image_url ? (
                      <img
                        src={philosopher.profile_image_url}
                        alt={philosopher.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary/40" />
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
            <button className="flex w-full items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-primary/5">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-col text-left">
                  <span className="truncate text-sm font-medium">{user?.email}</span>
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PhilosopherSidebar;