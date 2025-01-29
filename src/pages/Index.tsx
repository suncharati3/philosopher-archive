import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import PhilosopherGrid from "@/components/PhilosopherGrid";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Outlet } from "react-router-dom";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat" | "books">("info");
  const { selectedPhilosopher } = usePhilosophersStore();

  useEffect(() => {
    if (selectedPhilosopher) {
      setSelectedView("info");
    }
  }, [selectedPhilosopher?.id]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
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
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;