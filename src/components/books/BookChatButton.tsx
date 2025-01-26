import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface BookChatButtonProps {
  book: {
    title: string;
    publication_date?: string | null;
    summary?: string | null;
    key_concepts?: string | null;
    historical_context?: string | null;
    influence?: string | null;
  };
  onChatStart: () => void;
}

const BookChatButton = ({ book, onChatStart }: BookChatButtonProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();

  return (
    <Button onClick={onChatStart} className="w-full mt-4" size="lg">
      <MessageSquare className="mr-2 h-4 w-4" />
      Chat with {selectedPhilosopher?.name} about this book
    </Button>
  );
};

export default BookChatButton;