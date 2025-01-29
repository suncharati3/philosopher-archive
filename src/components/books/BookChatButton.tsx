import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface BookChatButtonProps {
  book: {
    title: string;
  };
  onChatStart: () => void;
}

const BookChatButton = ({ onChatStart }: BookChatButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onChatStart();
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