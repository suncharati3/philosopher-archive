import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface BookChatButtonProps {
  book: {
    title: string;
  };
  onChatStart: () => void;
}

const BookChatButton = ({ onChatStart }: BookChatButtonProps) => {
  return (
    <Button
      onClick={onChatStart}
      className="w-full mt-4"
      variant="secondary"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Chat about this book
    </Button>
  );
};

export default BookChatButton;