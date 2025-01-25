import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat">("info");
  const { selectedPhilosopher } = usePhilosophersStore();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          {selectedPhilosopher ? (
            <PhilosopherView 
              view={selectedView} 
              onViewChange={setSelectedView} 
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Select a philosopher from the sidebar to view their details</p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;