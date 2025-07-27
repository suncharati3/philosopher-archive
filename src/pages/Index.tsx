import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import PhilosopherGrid from "@/components/PhilosopherGrid";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useIsMobile } from "@/hooks/use-mobile";
import MobilePhilosopherSidebar from "@/components/mobile/MobilePhilosopherSidebar";
import MobileHeader from "@/components/mobile/MobileHeader";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat" | "books">("info");
  const { selectedPhilosopher, setSelectedPhilosopher } = usePhilosophersStore();
  const isMobile = useIsMobile();

  // Reset view to "info" whenever a new philosopher is selected
  useEffect(() => {
    if (selectedPhilosopher) {
      setSelectedView("info");
    }
  }, [selectedPhilosopher?.id]);

  const handleBackToMain = () => {
    setSelectedPhilosopher(null);
  };

  const handleBack = () => {
    setSelectedView("info");
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-ivory/50">
        {/* Desktop Sidebar */}
        {!isMobile && <PhilosopherSidebar />}
        
        {/* Mobile Sidebar */}
        {isMobile && <MobilePhilosopherSidebar />}
        
        <main className="flex-1 bg-background">
          {/* Mobile Header */}
          {isMobile && (
            <MobileHeader
              title={selectedPhilosopher ? selectedPhilosopher.name : "Philosophers"}
              showBackButton={!!selectedPhilosopher}
              onBack={selectedPhilosopher ? handleBackToMain : undefined}
              showMenuButton={!selectedPhilosopher}
            />
          )}
          
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