import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import { useToast } from "../ui/use-toast";

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
  const navigate = useNavigate();
  const { selectedPhilosopher } = usePhilosophersStore();
  const { sendMessage } = useChat();
  const { setIsPublicMode, setSelectedConversation } = useChatMode();
  const { toast } = useToast();

  const handleChatStart = async () => {
    try {
      // Prepare context about the book
      const bookContext = `
        Title: ${book.title}
        ${book.publication_date ? `Publication: ${book.publication_date}` : ''}
        ${book.summary ? `Summary: ${book.summary}` : ''}
        ${book.key_concepts ? `Key Concepts: ${book.key_concepts}` : ''}
        ${book.historical_context ? `Historical Context: ${book.historical_context}` : ''}
        ${book.influence ? `Influence: ${book.influence}` : ''}
      `;

      const message = `I would like to discuss your book "${book.title}". Here's what I know about it: ${bookContext}. Please explain this book's main ideas, its significance in your philosophical work, and how it connects to your broader philosophical framework.`;

      // Ensure we're in public mode for persistent conversations
      setIsPublicMode(true);

      // Create new conversation and send initial message
      const conversationId = await sendMessage(message, null, true);

      if (conversationId) {
        setSelectedConversation(conversationId);
        onChatStart();
        
        // Show success toast
        toast({
          title: "Starting conversation",
          description: `Let's discuss ${book.title} with ${selectedPhilosopher?.name}`,
        });

        // Navigate to the philosopher's chat view
        navigate(`/philosophers/${selectedPhilosopher?.id}/chat`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error starting conversation",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleChatStart}
      className="w-full mt-4"
      variant="secondary"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Chat about this book
    </Button>
  );
};

export default BookChatButton;