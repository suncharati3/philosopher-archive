import { useState, useEffect } from "react";
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
    <div className="flex h-screen overflow-hidden">
      <PhilosopherSidebar />
      <main className="flex-1 min-w-0 bg-background overflow-auto">
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
  );
};

export default Index;