import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BookCard from "./BookCard";
import BookDetails from "./BookDetails";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface BooksViewProps {
  philosopherId: number;
  onBack?: () => void;
}

const BooksView = ({ philosopherId, onBack }: BooksViewProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "major">("major"); // Default to major works
  const navigate = useNavigate();
  const { setSelectedPhilosopher } = usePhilosophersStore();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", philosopherId],
    queryFn: async () => {
      console.log("Fetching books for philosopher:", philosopherId);
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          philosopher:philosophers(*)
        `)
        .eq("philosopher_id", philosopherId)
        .order('is_major_work', { ascending: false }); // Show major works first

      if (error) {
        console.error("Error fetching books:", error);
        throw error;
      }
      console.log("Fetched books:", data);
      return data;
    },
  });

  const handleChatStart = (book: any) => {
    // Set the selected philosopher before navigating to chat
    if (book.philosopher) {
      setSelectedPhilosopher(book.philosopher);
      // Navigate to the philosopher's chat view
      navigate(`/philosophers/${book.philosopher.id}/chat`);
    }
  };

  if (selectedBookId && books) {
    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (selectedBook) {
      return (
        <BookDetails 
          book={selectedBook} 
          onBack={() => setSelectedBookId(null)}
          onChatStart={() => handleChatStart(selectedBook)}
        />
      );
    }
  }

  // Filter books based on the active tab
  const filteredBooks = books?.filter(book => {
    if (activeTab === "all") return true;
    return book.is_major_work === true;
  });

  return (
    <div className="p-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "major")}>
        <TabsList>
          <TabsTrigger value="major">Major Works</TabsTrigger>
          <TabsTrigger value="all">All Books</TabsTrigger>
        </TabsList>
        <TabsContent value="major">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <BookCard
                  key={`loading-${index}`}
                  book={{ id: "", title: "", publication_date: null, summary: null, cover_image_url: null }}
                  onClick={() => {}}
                  isLoading={true}
                />
              ))
            ) : filteredBooks?.length ? (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => setSelectedBookId(book.id)}
                  isMajorWork={book.is_major_work}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No major works found for this philosopher.
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <BookCard
                  key={`loading-${index}`}
                  book={{ id: "", title: "", publication_date: null, summary: null, cover_image_url: null }}
                  onClick={() => {}}
                  isLoading={true}
                />
              ))
            ) : filteredBooks?.length ? (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => setSelectedBookId(book.id)}
                  isMajorWork={book.is_major_work}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No books found for this philosopher.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BooksView;