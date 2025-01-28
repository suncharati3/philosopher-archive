import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Book } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface Book {
  id: string;
  title: string;
  philosopher_name: string;
  publication_date: string | null;
  summary: string | null;
  philosopher_id: number;
}

const Books = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { setSelectedPhilosopher } = usePhilosophersStore();
  
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data: booksData, error } = await supabase
        .from('books')
        .select(`
          *,
          philosophers (
            name
          )
        `);

      if (error) throw error;

      return booksData.map(book => ({
        id: book.id,
        title: book.title,
        philosopher_name: book.philosophers?.name || 'Unknown',
        publication_date: book.publication_date,
        summary: book.summary,
        philosopher_id: book.philosopher_id
      }));
    }
  });

  // Group books by philosopher
  const groupedBooks = (books || []).reduce((acc, book) => {
    if (!acc[book.philosopher_name]) {
      acc[book.philosopher_name] = [];
    }
    acc[book.philosopher_name].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  const handleBookClick = async (book: Book) => {
    const { data: philosopher } = await supabase
      .from('philosophers')
      .select('*')
      .eq('id', book.philosopher_id)
      .single();

    if (philosopher) {
      setSelectedPhilosopher(philosopher);
      setSelectedBook(book);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedBooks).map(([philosopher, books]) => (
          <Card key={philosopher} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{philosopher}</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[400px]">
              <CardContent className="p-4 space-y-4">
                {books.map((book) => (
                  <div 
                    key={book.id} 
                    className="space-y-2 p-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="flex items-start gap-3">
                      <Book className="h-5 w-5 text-primary/60 mt-1" />
                      <div>
                        <h3 className="font-medium text-primary/80">{book.title}</h3>
                        {book.publication_date && (
                          <p className="text-xs text-muted-foreground">Published: {book.publication_date}</p>
                        )}
                        {book.summary && (
                          <p className="text-sm text-muted-foreground mt-2">{book.summary}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Discuss "{selectedBook?.title}" with {selectedBook?.philosopher_name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedBook && (
              <ChatInterface />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Books;