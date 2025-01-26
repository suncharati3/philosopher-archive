import { Quote, Star, Award, AlertTriangle, MessageSquareShare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PhilosopherIdeas from "./tabs/PhilosopherIdeas";
import PhilosopherQuotes from "./tabs/PhilosopherQuotes";
import PhilosopherLegacy from "./tabs/PhilosopherLegacy";
import PhilosopherShare from "./tabs/PhilosopherShare";

interface PhilosopherDetailTabsProps {
  philosopher: {
    id: number;
    name: string;
    short_description: string;
    core_ideas: string;
    key_ideas: string;
    quotes: string;
    influences: string;
    controversies: string;
  };
}

const PhilosopherDetailTabs = ({ philosopher }: PhilosopherDetailTabsProps) => {
  const quotes = philosopher.quotes?.split('\n').filter(Boolean) || [];
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()) || [];
  const keyIdeas = philosopher.key_ideas?.split(',').map(idea => {
    const [title, description] = idea.split(':').map(part => part.trim());
    return { title, description };
  }) || [];
  const influences = philosopher.influences?.split('\n') || [];
  const controversies = philosopher.controversies?.split('\n') || [];

  return (
    <div className="space-y-8">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed">{philosopher.short_description}</p>
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent overflow-x-auto">
          <TabsTrigger value="ideas" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Star className="mr-2 h-4 w-4" />
            Key Ideas
          </TabsTrigger>
          <TabsTrigger value="quotes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Quote className="mr-2 h-4 w-4" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="legacy" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Award className="mr-2 h-4 w-4" />
            Legacy
          </TabsTrigger>
          <TabsTrigger value="share" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <MessageSquareShare className="mr-2 h-4 w-4" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-8">
          <PhilosopherIdeas concepts={concepts} keyIdeas={keyIdeas} />
        </TabsContent>

        <TabsContent value="quotes" className="mt-8">
          <PhilosopherQuotes quotes={quotes} />
        </TabsContent>

        <TabsContent value="legacy" className="mt-8">
          <PhilosopherLegacy influences={influences} controversies={controversies} />
        </TabsContent>

        <TabsContent value="share" className="mt-8">
          <PhilosopherShare philosopherId={philosopher.id} philosopherName={philosopher.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosopherDetailTabs;