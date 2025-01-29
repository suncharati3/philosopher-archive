import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { Lock, Bot } from "lucide-react";
import { TokenBalanceDisplay } from "@/components/tokens/TokenBalanceDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ChatHeaderProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
}

const ChatHeader = ({ isPublicMode, setIsPublicMode }: ChatHeaderProps) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const { toast } = useToast();

  // Fetch user role and AI provider preference
  const { data: userSettings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [{ data: roles }, { data: settings }] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', user.id).single(),
        supabase.from('user_token_settings').select('preferred_ai_provider').eq('user_id', user.id).single()
      ]);

      return {
        isAdmin: roles?.role === 'admin',
        aiProvider: settings?.preferred_ai_provider || 'deepseek'
      };
    }
  });

  const handleModeChange = (checked: boolean) => {
    setIsPublicMode(!checked); // Invert because checked means confession mode
    console.log("Chat mode changed:", !checked ? "public" : "confession");
  };

  const handleProviderToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('toggle_ai_provider');
      
      if (error) throw error;

      toast({
        title: "AI Provider Updated",
        description: `Switched to ${data} API`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle AI provider",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={selectedPhilosopher?.profile_image_url}
            alt={selectedPhilosopher?.name}
          />
          <AvatarFallback>{selectedPhilosopher?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{selectedPhilosopher?.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPhilosopher?.era}
          </p>
        </div>
        <TokenBalanceDisplay />
        {userSettings?.isAdmin && (
          <div className="flex items-center gap-2 mr-4">
            <Bot className="h-4 w-4" />
            <Switch
              checked={userSettings.aiProvider === 'openai'}
              onCheckedChange={handleProviderToggle}
            />
            <Label className="text-sm">
              {userSettings.aiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'}
            </Label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Switch
            id="confession-mode"
            checked={!isPublicMode}
            onCheckedChange={handleModeChange}
          />
          <Label htmlFor="confession-mode" className="flex items-center gap-1">
            {!isPublicMode && <Lock className="h-4 w-4" />}
            Confession Mode
          </Label>
        </div>
      </div>
      {!isPublicMode && (
        <Alert className="mx-4 mb-4 bg-muted border-muted-foreground/20">
          <AlertDescription className="text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Confession mode active - Your conversation will not be saved
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatHeader;