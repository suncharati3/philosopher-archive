import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Lightbulb } from "lucide-react";

const UserMenu = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link to="/books" className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          Books & Scripts
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link to="/ideas" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Ideas
        </Link>
      </Button>
    </div>
  );
};

export default UserMenu;