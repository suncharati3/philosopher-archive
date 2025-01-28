import { Users } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { type Philosopher } from "@/store/usePhilosophersStore";

interface PhilosopherListProps {
  philosophers: Philosopher[];
  selectedPhilosopher: Philosopher | null;
  onPhilosopherSelect: (philosopher: Philosopher) => void;
}

const PhilosopherList = ({ philosophers, selectedPhilosopher, onPhilosopherSelect }: PhilosopherListProps) => {
  return (
    <SidebarMenu>
      {philosophers.map((philosopher) => (
        <SidebarMenuItem key={philosopher.id}>
          <SidebarMenuButton
            onClick={() => onPhilosopherSelect(philosopher)}
            isActive={selectedPhilosopher?.id === philosopher.id}
            className={`min-h-[48px] transition-colors ${
              selectedPhilosopher?.id === philosopher.id 
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-lg flex-shrink-0 bg-primary/5">
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
  );
};

export default PhilosopherList;