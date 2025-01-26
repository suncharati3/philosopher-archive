import { Book, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../ChatInterface";
import { useState } from "react";

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
  };
  onBack: () => void;
}

const BookDetails = ({ book, onBack }: BookDetailsProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const { sendMessage } = useChat();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  const handleChatAboutBook = async () => {
    const bookContext = `
      Title: ${book.title}
      ${book.publication_date ? `Publication: ${book.publication_date}` : ''}
      ${book.summary ? `Summary: ${book.summary}` : ''}
      ${book.key_concepts ? `Key Concepts: ${book.key_concepts}` : ''}
      ${book.historical_context ? `Historical Context: ${book.historical_context}` : ''}
      ${book.influence ? `Influence: ${book.influence}` : ''}
    `;
    
    const message = `I would like to discuss your book "${book.title}". Here's what I know about it: ${bookContext}. Please explain this book's main ideas, its significance in your philosophical work, and how it connects to your broader philosophical framework.`;
    
    const conversationId = await sendMessage(message, null, true);
    if (conversationId) {
      toast({
        title: "Starting conversation",
        description: `Let's discuss ${book.title} with ${selectedPhilosopher?.name}`,
      });
      setShowChat(true);
    }
  };

  if (showChat) {
    return (
      <div className="h-full">
        <div className="flex items-center gap-4 p-4 border-b">
          <Button variant="ghost" onClick={() => setShowChat(false)} className="mb-0">
            ← Back to Book Details
          </Button>
          <div className="flex items-center gap-2">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="h-10 w-8 object-cover rounded"
              />
            ) : (
              <Book className="h-10 w-8 text-muted-foreground" />
            )}
            <h3 className="font-semibold">{book.title}</h3>
          </div>
        </div>
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to Books
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader className="space-y-4">
              <div className="aspect-[3/4] bg-primary/5 rounded-lg overflow-hidden">
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Book className="w-20 h-20 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold">{book.title}</h2>
              {book.publication_date && (
                <p className="text-muted-foreground">
                  Published: {book.publication_date}
                </p>
              )}
            </CardHeader>
          </Card>
        </div>
        <div className="space-y-6">
          {book.summary && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{book.summary}</p>
              </CardContent>
            </Card>
          )}
          {book.key_concepts && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {book.key_concepts.split(",").map((concept, index) => (
                    <Badge key={index} variant="secondary">
                      {concept.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {book.historical_context && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Historical Context</h3>
                <p className="text-muted-foreground">{book.historical_context}</p>
              </CardContent>
            </Card>
          )}
          {book.influence && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Influence</h3>
                <p className="text-muted-foreground">{book.influence}</p>
                <Button 
                  onClick={handleChatAboutBook} 
                  className="w-full mt-4"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with {selectedPhilosopher?.name} about this book
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;