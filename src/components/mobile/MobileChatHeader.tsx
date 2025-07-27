import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { TokenBalanceDisplay } from "../tokens/TokenBalanceDisplay";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileChatHeader = () => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  return (isMobile && selectedPhilosopher) ? (
    <div className="sticky top-14 z-30 bg-background border-b border-border/20">
      <div className="px-4 py-3">
        {/* Philosopher Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-11 w-11 ring-2 ring-primary/10">
              <AvatarImage
                src={selectedPhilosopher.profile_image_url || "/placeholder.svg"}
                alt={selectedPhilosopher.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {selectedPhilosopher.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base truncate">
                {selectedPhilosopher.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {selectedPhilosopher.era}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <TokenBalanceDisplay />
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MobileChatHeader;