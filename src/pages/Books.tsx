import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BookCard from "@/components/books/BookCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Books = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          philosophers:philosopher_id (
            id,
            name,
            era,
            nationality
          )
        `)
        .order('title', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const majorWorks = books?.filter(book => book.is_major_work) || [];
  const otherWorks = books?.filter(book => !book.is_major_work) || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Book className="h-8 w-8" />
          Books & Scripts
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Works</TabsTrigger>
          <TabsTrigger value="major">Major Works</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <BookCard
                  key={`loading-${index}`}
                  book={{
                    id: "",
                    title: "",
                    publication_date: null,
                    summary: null,
                    cover_image_url: null,
                  }}
                  onClick={() => {}}
                  isLoading={true}
                />
              ))
            ) : books?.length ? (
              books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => {}}
                  isMajorWork={book.is_major_work}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No books found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="major" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <BookCard
                  key={`loading-${index}`}
                  book={{
                    id: "",
                    title: "",
                    publication_date: null,
                    summary: null,
                    cover_image_url: null,
                  }}
                  onClick={() => {}}
                  isLoading={true}
                />
              ))
            ) : majorWorks.length ? (
              majorWorks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => {}}
                  isMajorWork={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No major works found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Books;