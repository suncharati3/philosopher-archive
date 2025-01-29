import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useToast } from "../ui/use-toast";
import ChatInterface from "../ChatInterface";
import { useState, useEffect } from "react";
import BookCover from "./BookCover";
import BookSection from "./BookSection";
import BookChatButton from "./BookChatButton";
import BookChatHeader from "./BookChatHeader";
import { useChatMode } from "@/hooks/useChatMode";

interface BookDetailsProps {
  book: {
    id: string;
    title: string;
    publication_date: string | null;
    summary: string | null;
    key_concepts: string | null;
    historical_context: string | null;
    influence: string | null;
    cover_image_url: string | null;
    philosopher?: {
      name: string;
    } | null;
  };
  onBack: () => void;
}

const BookDetails = ({ book, onBack }: BookDetailsProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);
  const { setSelectedConversation, setIsPublicMode } = useChatMode();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (showChat && currentConversationId) {
      setSelectedConversation(currentConversationId);
    }
  }, [showChat, currentConversationId, setSelectedConversation]);

  const handleChatAboutBook = async () => {
    if (!book.philosopher?.name) {
      toast({
        title: "Error",
        description: "No philosopher associated with this book",
        variant: "destructive",
      });
      return;
    }

    const bookContext = `
      Title: ${book.title}
      ${book.publication_date ? `Publication: ${book.publication_date}` : ''}
      ${book.summary ? `Summary: ${book.summary}` : ''}
      ${book.key_concepts ? `Key Concepts: ${book.key_concepts}` : ''}
      ${book.historical_context ? `Historical Context: ${book.historical_context}` : ''}
      ${book.influence ? `Influence: ${book.influence}` : ''}
    `;
    
    const message = `I would like to discuss your book "${book.title}". Here's what I know about it: ${bookContext}. Please explain this book's main ideas, its significance in your philosophical work, and how it connects to your broader philosophical framework.`;
    
    try {
      setIsPublicMode(true);
      const conversationId = await sendMessage(message, null, true);
      
      if (conversationId) {
        setCurrentConversationId(conversationId);
        setSelectedConversation(conversationId);
        
        toast({
          title: "Starting conversation",
          description: `Let's discuss ${book.title} with ${selectedPhilosopher?.name}`,
        });
        setShowChat(true);
      }
    } catch (error) {
      toast({
        title: "Error starting conversation",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showChat) {
    return (
      <div className="h-full">
        <BookChatHeader
          title={book.title}
          coverImageUrl={book.cover_image_url}
          onBack={() => setShowChat(false)}
        />
        <ChatInterface key={currentConversationId} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Books
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <BookCover
            title={book.title}
            coverImageUrl={book.cover_image_url}
            publicationDate={book.publication_date}
            authorName={book.philosopher?.name}
          />
        </div>
        <div className="space-y-6">
          <BookSection title="Summary" content={book.summary} />
          <BookSection
            title="Key Concepts"
            content={book.key_concepts}
            type="tags"
          />
          <BookSection
            title="Historical Context"
            content={book.historical_context}
          />
          <BookSection title="Influence" content={book.influence}>
            {book.philosopher?.name && (
              <BookChatButton 
                book={{
                  title: book.title,
                  philosopher: { name: book.philosopher.name }
                }} 
                onChatStart={handleChatAboutBook}
              />
            )}
          </BookSection>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;