import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BooksViewProps {
  philosopherId: number;
  onBack?: () => void;
}

const BooksView = ({ philosopherId, onBack }: BooksViewProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", philosopherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("philosopher_id", philosopherId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading books...</div>;
  }

  if (!books?.length) {
    return (
      <div className="p-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        )}
        <p className="text-muted-foreground">No books found for this philosopher.</p>
      </div>
    );
  }

  if (selectedBookId) {
    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (selectedBook) {
      return (
        <div>
          <div className="flex gap-2 p-4">
            <Button variant="ghost" onClick={() => setSelectedBookId(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main Page
            </Button>
          </div>
          <BookDetails book={selectedBook} onBack={() => setSelectedBookId(null)} />
        </div>
      );
    }
  }

  return (
    <div className="p-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => setSelectedBookId(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BooksView;