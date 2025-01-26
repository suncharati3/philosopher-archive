import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PhilosopherSidebar from "@/components/PhilosopherSidebar";
import SuggestionsSection from "@/components/suggestions/SuggestionsSection";

const Suggestions = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-ivory/50">
        <PhilosopherSidebar />
        <main className="flex-1 bg-background">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold ml-4">Suggestions</h1>
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