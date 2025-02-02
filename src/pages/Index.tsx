import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import PhilosopherGrid from "@/components/PhilosopherGrid";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat" | "books">("info");
  const { selectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  // Reset view to "info" whenever a new philosopher is selected
  useEffect(() => {
    if (selectedPhilosopher) {
      setSelectedView("info");
    }
  }, [selectedPhilosopher?.id]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-ivory/50">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          {selectedPhilosopher ? (
            <PhilosopherView 
              view={selectedView} 
              onViewChange={setSelectedView} 
            />
          ) : (
            <PhilosopherGrid />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;