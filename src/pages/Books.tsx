import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Books = () => {
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
      <div className="text-muted-foreground text-center py-12">
        Books and scripts content will be displayed here.
      </div>
    </div>
  );
};

export default Books;