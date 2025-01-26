import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "lucide-react";
import { useToast } from "../ui/use-toast";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";

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
    return <BookDetails book={selectedBook} onBack={() => setSelectedBook(null)} />;
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
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksView;