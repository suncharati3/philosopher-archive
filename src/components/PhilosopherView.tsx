import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import ChatInterface from "./ChatInterface";
import BooksView from "./books/BooksView";
import PhilosopherHeader from "./philosopher/PhilosopherHeader";
import PhilosopherQuickInfo from "./philosopher/PhilosopherQuickInfo";
import PhilosopherDetailTabs from "./philosopher/PhilosopherDetailTabs";

interface PhilosopherViewProps {
  view: "info" | "chat" | "books";
  onViewChange: (view: "info" | "chat" | "books") => void;
}

const PhilosopherView = ({ view, onViewChange }: PhilosopherViewProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  if (!selectedPhilosopher) return null;

  return (
    <div className="h-full">
      <PhilosopherHeader
        name={selectedPhilosopher.name}
        nationality={selectedPhilosopher.nationality}
        era={selectedPhilosopher.era}
        view={view}
        onViewChange={onViewChange}
      />

      <div className="h-[calc(100vh-8rem)] overflow-auto">
        {view === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <PhilosopherQuickInfo philosopher={selectedPhilosopher} />
            <PhilosopherDetailTabs philosopher={selectedPhilosopher} />
          </div>
        )}
        {view === "chat" && <ChatInterface />}
        {view === "books" && <BooksView philosopherId={selectedPhilosopher.id} />}
      </div>
    </div>
  );
};

export default PhilosopherView;