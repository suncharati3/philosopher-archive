import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import PhilosopherGrid from "@/components/PhilosopherGrid";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat">("info");
  const { selectedPhilosopher, setSelectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          {selectedPhilosopher ? (
            <div>
              <div className="flex items-center gap-2 p-3 md:p-4 border-b">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPhilosopher(null)}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </div>
              <PhilosopherView 
                view={selectedView} 
                onViewChange={setSelectedView} 
              />
            </div>
          ) : (
            <PhilosopherGrid />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;