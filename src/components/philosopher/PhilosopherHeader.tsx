import { Book, MessageSquare, User } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface PhilosopherHeaderProps {
  name: string;
  nationality: string;
  era: string;
  view: "info" | "chat" | "books";
  onViewChange: (view: "info" | "chat" | "books") => void;
}

const PhilosopherHeader = ({ 
  name, 
  nationality, 
  era, 
  view, 
  onViewChange 
}: PhilosopherHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            {name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {nationality} • {era}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "books" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("books")}
          >
            <Book className="mr-2 h-4 w-4" />
            Books
          </Button>
          <Button
            variant={view === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with {name}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherHeader;