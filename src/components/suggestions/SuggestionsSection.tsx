import { Card } from "@/components/ui/card";
import SuggestionForm from "./SuggestionForm";
import SuggestionList from "./SuggestionList";

const SuggestionsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Submit a Suggestion</h2>
        <SuggestionForm />
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Suggestions</h2>
        <SuggestionList />
      </div>
    </div>
  );
};

export default SuggestionsSection;