import { Card } from "@/components/ui/card";
import SuggestionForm from "./SuggestionForm";
import SuggestionList from "./SuggestionList";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

const SuggestionsSection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSuggestionSubmitted = () => {
    queryClient.invalidateQueries({ queryKey: ["suggestions"] });
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Please log in to view and submit suggestions.
        </p>
      </Card>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Suggestions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us improve the Philosopher's Platform by suggesting new figures, features, or improvements. 
          Your input shapes the future of philosophical discourse!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Submit a Suggestion</h2>
            <p className="text-muted-foreground mb-4">
              Share your ideas and help us expand our philosophical community. Each approved suggestion 
              earns you bonus tokens!
            </p>
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Why Submit Suggestions?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Earn bonus tokens for approved suggestions</li>
                <li>Help expand our philosophical knowledge base</li>
                <li>Contribute to meaningful discussions</li>
                <li>Shape the platform's development</li>
              </ul>
            </div>
          </div>
          <SuggestionForm onSuccess={handleSuggestionSubmitted} />
        </Card>
        
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Your Suggestions</h2>
            <p className="text-muted-foreground">
              Track the status of your submissions and see their impact on the platform.
            </p>
          </div>
          <SuggestionList />
        </div>
      </div>
    </div>
  );
};

export default SuggestionsSection;