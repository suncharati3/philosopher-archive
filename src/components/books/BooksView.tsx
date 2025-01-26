import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";

interface Book {
  id: string;
  title: string;
  publication_date: string | null;
  summary: string | null;
  key_concepts: string | null;
  historical_context: string | null;
  influence: string | null;
  cover_image_url: string | null;
}

interface BooksViewProps {
  philosopherId: number;
}

const BooksView = ({ philosopherId }: BooksViewProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("philosopher_id", philosopherId);

      if (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error",
          description: "Failed to load books. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (!data || data.length === 0) {
        toast({
          title: "No books found",
          description: "No books are available for this philosopher.",
        });
      }

      setBooks(data || []);
    };

    fetchBooks();
  }, [philosopherId, toast]);

  if (selectedBook) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedBook(null)}
          className="mb-4"
        >
          ← Back to Books
        </Button>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader className="space-y-4">
                <div className="aspect-[3/4] bg-primary/5 rounded-lg overflow-hidden">
                  {selectedBook.cover_image_url ? (
                    <img
                      src={selectedBook.cover_image_url}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Book className="w-20 h-20 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                {selectedBook.publication_date && (
                  <p className="text-muted-foreground">
                    Published: {selectedBook.publication_date}
                  </p>
                )}
              </CardHeader>
            </Card>
          </div>
          <div className="space-y-6">
            {selectedBook.summary && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground">{selectedBook.summary}</p>
                </CardContent>
              </Card>
            )}
            {selectedBook.key_concepts && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Key Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.key_concepts.split(",").map((concept, index) => (
                      <Badge key={index} variant="secondary">
                        {concept.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {selectedBook.historical_context && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Historical Context</h3>
                  <p className="text-muted-foreground">
                    {selectedBook.historical_context}
                  </p>
                </CardContent>
              </Card>
            )}
            {selectedBook.influence && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Influence</h3>
                  <p className="text-muted-foreground">{selectedBook.influence}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Major Works</h2>
      {books.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No books available.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedBook(book)}
            >
              <div className="aspect-[3/4] bg-primary/5">
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Book className="w-16 h-16 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{book.title}</h3>
                {book.publication_date && (
                  <p className="text-sm text-muted-foreground">
                    Published: {book.publication_date}
                  </p>
                )}
                {book.summary && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {book.summary}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksView;