import { Book, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useToast } from "../ui/use-toast";

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

  const handleChatAboutBook = async () => {
    const message = `Please explain your book "${book.title}" in detail. What are its main themes, arguments, and significance? How does it relate to your overall philosophical framework?`;
    const conversationId = await sendMessage(message, null, true);
    if (conversationId) {
      toast({
        title: "Chat started",
        description: `Starting a conversation about ${book.title}`,
      });
    }
  };

  const handleDiscussBook = async () => {
    const bookContext = `
      Title: ${book.title}
      Publication: ${book.publication_date}
      Summary: ${book.summary}
      Key Concepts: ${book.key_concepts}
      Historical Context: ${book.historical_context}
      Influence: ${book.influence}
    `;
    
    const message = `Let's discuss this book in detail. Here's what I know about it: ${bookContext}`;
    const conversationId = await sendMessage(message, null, true);
    if (conversationId) {
      toast({
        title: "Discussion started",
        description: `Starting an in-depth discussion about ${book.title}`,
      });
    }
  };

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
              <div className="flex gap-2">
                <Button onClick={handleChatAboutBook} className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask about this Book
                </Button>
                <Button onClick={handleDiscussBook} variant="outline" className="flex-1">
                  <Book className="mr-2 h-4 w-4" />
                  Discuss Content
                </Button>
              </div>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;