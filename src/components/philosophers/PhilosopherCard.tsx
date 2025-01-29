import { Card } from "@/components/ui/card";
import { type Philosopher } from "@/store/usePhilosophersStore";
import { useImpressions } from "@/hooks/useImpressions";
import { useToast } from "@/hooks/use-toast";
import PhilosopherCardImage from "./PhilosopherCardImage";
import PhilosopherCardContent from "./PhilosopherCardContent";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  onClick: (philosopher: Philosopher) => void;
}

const PhilosopherCard = ({ philosopher, onClick }: PhilosopherCardProps) => {
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()).slice(0, 3) || [];
  const { likes, interactions, addImpression } = useImpressions("philosopher", philosopher.id.toString());
  const { toast } = useToast();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', philosopher.profile_image_url);
    e.currentTarget.src = '/placeholder.svg';
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await addImpression("like");
    if (success) {
      toast({
        title: "Thanks for your feedback!",
        description: `You liked ${philosopher.name}'s profile.`,
      });
    }
  };

  return (
    <Card 
      key={philosopher.id}
      className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 cursor-pointer bg-background"
      onClick={() => {
        onClick(philosopher);
        addImpression("view");
      }}
    >
      <PhilosopherCardImage
        imageUrl={philosopher.profile_image_url}
        name={philosopher.name}
        likes={likes}
        interactions={interactions}
        onLike={handleLike}
        onImageError={handleImageError}
      />
      <PhilosopherCardContent
        name={philosopher.name}
        era={philosopher.era}
        nationality={philosopher.nationality}
        concepts={concepts}
        coreIdeas={philosopher.core_ideas}
      />
    </Card>
  );
};

export default PhilosopherCard;