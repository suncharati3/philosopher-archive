import { Card, CardContent } from "../ui/card";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PhilosopherImageCarousel from "./PhilosopherImageCarousel";
import PhilosopherPersonalInfo from "./PhilosopherPersonalInfo";
import PhilosopherFramework from "./PhilosopherFramework";
import PhilosopherPersonality from "./PhilosopherPersonality";

interface PhilosopherQuickInfoProps {
  philosopher: {
    id: number;
    profile_image_url: string;
    name: string;
    full_name: string;
    lifespan: string;
    nationality: string;
    era: string;
    framework: string;
    style: string;
    personality: string;
  };
}

const PhilosopherQuickInfo = ({ philosopher }: PhilosopherQuickInfoProps) => {
  const { user } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data;
    },
    enabled: !!user,
  });

  const handleUploadComplete = (newUrl: string) => {
    console.log('Image uploaded:', newUrl);
  };

  return (
    <div className="space-y-6">
      <PhilosopherImageCarousel
        philosopherId={philosopher.id}
        name={philosopher.name}
        imageUrl={philosopher.profile_image_url}
        isAdmin={isAdmin}
        onUploadComplete={handleUploadComplete}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          <PhilosopherPersonalInfo
            fullName={philosopher.full_name}
            name={philosopher.name}
            lifespan={philosopher.lifespan}
            nationality={philosopher.nationality}
            era={philosopher.era}
          />

          <PhilosopherFramework
            framework={philosopher.framework}
            style={philosopher.style}
          />

          <PhilosopherPersonality
            personality={philosopher.personality}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PhilosopherQuickInfo;