import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChatMode } from "@/hooks/useChatMode";
import { supabase } from "@/integrations/supabase/client";

interface BookChatButtonProps {
  book: {
    title: string;
    publication_date: string | null;
    summary: string | null;
    key_concepts: string | null;
    historical_context: string | null;
    influence: string | null;
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
  const { setIsPublicMode, setSelectedConversation } = useChatMode();

  const generateInitialMessage = () => {
    return `I would like to discuss your book "${book.title}". Here's what I know about it:

Title: ${book.title}
${book.publication_date ? `Publication: ${book.publication_date}` : ''}
${book.summary ? `Summary: ${book.summary}` : ''}
${book.key_concepts ? `Key Concepts: ${book.key_concepts}` : ''}
${book.historical_context ? `Historical Context: ${book.historical_context}` : ''}
${book.influence ? `Influence: ${book.influence}` : ''}

Please explain this book's main ideas, its significance in your philosophical work, and how it connects to your broader philosophical framework.`;
  };

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

      // Create a new conversation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          philosopher_id: philosopher.id,
          user_id: user.id,
          mode: 'public'
        })
        .select()
        .single();

      if (conversationError) {
        throw conversationError;
      }

      // Save the initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: generateInitialMessage(),
          is_ai: false
        });

      if (messageError) {
        throw messageError;
      }

      // Set the new conversation as active
      setSelectedConversation(conversation.id);
      
      // Navigate to the philosopher view with chat tab
      navigate("/", { 
        state: { view: "chat" },
        replace: true
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