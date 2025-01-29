import { User, Settings, Coins, MessageSquarePlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
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
      <DropdownMenuContent 
        align="start" 
        className="w-[240px] bg-white dark:bg-gray-950 shadow-lg border border-border/50 backdrop-blur-none"
        sideOffset={8}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem onClick={() => handleNavigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/suggestions')}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Suggestions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/tokens')}>
          <Coins className="mr-2 h-4 w-4" />
          Tokens
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:!text-red-600 focus:!text-red-600">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;