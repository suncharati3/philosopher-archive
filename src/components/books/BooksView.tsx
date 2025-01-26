import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface BooksViewProps {
  philosopherId: number;
  onBack?: () => void;
}

const BooksView = ({ philosopherId, onBack }: BooksViewProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", philosopherId],
    queryFn: async () => {
      console.log("Fetching books for philosopher:", philosopherId);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("philosopher_id", philosopherId);

      if (error) {
        console.error("Error fetching books:", error);
        throw error;
      }
      console.log("Fetched books:", data);
      return data;
    },
  });

  if (selectedBookId && books) {
    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (selectedBook) {
      return <BookDetails book={selectedBook} onBack={() => setSelectedBookId(null)} />;
    }
  }

  return (
    <div className="p-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <BookCard
              key={`loading-${index}`}
              book={{ id: "", title: "", publication_date: null, summary: null, cover_image_url: null }}
              onClick={() => {}}
              isLoading={true}
            />
          ))
        ) : books?.length ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setSelectedBookId(book.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No books found for this philosopher.
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksView;