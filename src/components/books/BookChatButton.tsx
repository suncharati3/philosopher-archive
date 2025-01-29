import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

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
  const { setSelectedPhilosopher } = usePhilosophersStore();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      console.log("Starting chat about book:", book.title);
      
      // Set the philosopher for the chat
      const philosopherName = book.philosopher?.name;
      if (!philosopherName) {
        throw new Error("No philosopher associated with this book");
      }

      // Call the onChatStart callback
      await onChatStart();

      // Navigate to the chat page with the initial message about the book
      navigate(`/chat?message=Tell me about the book "${book.title}" by ${philosopherName}`);

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