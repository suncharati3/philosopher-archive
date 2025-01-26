import { SidebarProvider } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import { Card } from "@/components/ui/card";
import SuggestionsSection from "@/components/suggestions/SuggestionsSection";

const Suggestions = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-ivory/50">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 md:py-8 lg:py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
              Suggestions
            </h1>
            <Card className="p-6">
              <SuggestionsSection />
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Suggestions;