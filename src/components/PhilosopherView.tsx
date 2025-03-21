import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "./ChatInterface";
import BooksView from "./books/BooksView";
import PhilosopherHeader from "./philosopher/PhilosopherHeader";
import PhilosopherQuickInfo from "./philosopher/PhilosopherQuickInfo";
import PhilosopherDetailTabs from "./philosopher/PhilosopherDetailTabs";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

interface PhilosopherViewProps {
  view: "info" | "chat" | "books";
  onViewChange: (view: "info" | "chat" | "books") => void;
}

const PhilosopherView = ({ view, onViewChange }: PhilosopherViewProps) => {
  const { selectedPhilosopher, setSelectedPhilosopher } = usePhilosophersStore();
  const navigate = useNavigate();
  const { view: urlView } = useParams();

  useEffect(() => {
    if (urlView && urlView !== view) {
      onViewChange(urlView as "info" | "chat" | "books");
    }
  }, [urlView, view, onViewChange]);

  if (!selectedPhilosopher) {
    navigate("/");
    return null;
  }

  const handleBack = () => {
    setSelectedPhilosopher(null);
    navigate("/");
  };

  return (
    <div className="h-full">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="m-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Philosophers
        </Button>
        <PhilosopherHeader
          name={selectedPhilosopher.name}
          nationality={selectedPhilosopher.nationality}
          era={selectedPhilosopher.era}
          view={view}
          onViewChange={onViewChange}
        />
      </div>

      <div className="h-[calc(100vh-8rem)] overflow-auto">
        {view === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <PhilosopherQuickInfo philosopher={selectedPhilosopher} />
            <PhilosopherDetailTabs philosopher={selectedPhilosopher} />
          </div>
        )}
        {view === "chat" && <ChatInterface />}
        {view === "books" && (
          <BooksView 
            philosopherId={selectedPhilosopher.id} 
            onBack={() => onViewChange("info")} 
          />
        )}
      </div>
    </div>
  );
};

export default PhilosopherView;