import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import SuggestionsSection from "@/components/suggestions/SuggestionsSection";

const Suggestions = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-ivory/50">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Suggestions</h1>
          </div>
          <div className="p-6">
            <SuggestionsSection />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Suggestions;