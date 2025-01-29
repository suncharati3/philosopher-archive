import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChatMode } from "@/hooks/useChatMode";

interface BookChatButtonProps {
  book: {
    title: string;
    philosopher: {
      name: string;
    };
  };
  onChatStart: () => void;
}

const BookChatButton = ({ book, onChatStart }: BookChatButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setSelectedPhilosopher, philosophers } = usePhilosophersStore();
  const { setIsPublicMode } = useChatMode();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      console.log("Starting chat about book:", book.title);
      
      // Find the philosopher by name
      const philosopher = philosophers.find(p => p.name === book.philosopher.name);
      if (!philosopher) {
        throw new Error("Philosopher not found");
      }

      // Set the philosopher in the store
      setSelectedPhilosopher(philosopher);
      
      // Set public mode for the chat
      setIsPublicMode(true);
      
      // Call the onChatStart callback which will handle the conversation setup
      await onChatStart();
      
      // Navigate to the philosopher view with chat tab
      navigate("/", { 
        state: { view: "chat" },
        replace: true // Use replace to avoid adding to history
      });

    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full mt-4"
      variant="secondary"
      disabled={isLoading}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {isLoading ? "Starting chat..." : "Chat about this book"}
    </Button>
  );
};

export default BookChatButton;