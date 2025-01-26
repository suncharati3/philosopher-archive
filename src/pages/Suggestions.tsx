import { Card } from "@/components/ui/card";
import SuggestionsSection from "@/components/suggestions/SuggestionsSection";

const Suggestions = () => {
  return (
    <div className="container py-6 md:py-8 lg:py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
        Suggestions
      </h1>
      <Card className="p-6">
        <SuggestionsSection />
      </Card>
    </div>
  );
};

export default Suggestions;