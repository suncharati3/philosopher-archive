import { Button } from "./ui/button";
import { MessageSquare, Info } from "lucide-react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface PhilosopherViewProps {
  view: "info" | "chat";
  onViewChange: (view: "info" | "chat") => void;
}

const PhilosopherView = ({ view, onViewChange }: PhilosopherViewProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  if (!selectedPhilosopher) return null;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h1 className="text-2xl font-bold">{selectedPhilosopher.name}</h1>
        <div className="flex gap-2">
          <Button
            variant={view === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("info")}
          >
            <Info className="mr-2 h-4 w-4" />
            Info
          </Button>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      <div className="p-6">
        {view === "info" ? (
          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={selectedPhilosopher.profile_image_url}
                alt={selectedPhilosopher.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold">Background</h2>
                <p className="text-muted-foreground">
                  {selectedPhilosopher.nationality} • {selectedPhilosopher.era}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Core Ideas</h2>
                <p className="text-muted-foreground">{selectedPhilosopher.core_ideas}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
            <p className="text-muted-foreground">Chat feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhilosopherView;