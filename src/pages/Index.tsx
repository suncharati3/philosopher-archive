import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import PhilosopherView from "@/components/PhilosopherView";
import PhilosopherGrid from "@/components/PhilosopherGrid";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Index = () => {
  const [selectedView, setSelectedView] = useState<"info" | "chat">("info");
  const { selectedPhilosopher, setSelectedPhilosopher } = usePhilosophersStore();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          {selectedPhilosopher ? (
            <div>
              <div className="p-4 border-b">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPhilosopher(null)}
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
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