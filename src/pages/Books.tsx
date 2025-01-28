import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookCard from "@/components/books/BookCard";
import { useState } from "react";

const Books = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "major">("all");

  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      console.log("Fetching all books");
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          philosopher:philosophers(name)
        `);

      if (error) {
        console.error("Error fetching books:", error);
        throw error;
      }
      console.log("Fetched books:", data);
      return data;
    },
  });

  // Filter books based on the active tab
  const filteredBooks = books?.filter(book => {
    if (activeTab === "all") return true;
    return book.is_major_work === true;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Philosophical Works</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "major")}>
          <TabsList>
            <TabsTrigger value="all">All Works</TabsTrigger>
            <TabsTrigger value="major">Major Works</TabsTrigger>
          </TabsList>
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
                    onClick={() => {}}
                    isMajorWork={book.is_major_work}
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
    </div>
  );
};

export default Books;