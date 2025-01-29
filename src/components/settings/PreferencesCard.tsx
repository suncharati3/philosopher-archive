import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/theme-provider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const PreferencesCard = () => {
  const { theme, setTheme } = useTheme();

  const { data: userSettings, refetch } = useQuery({
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

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleProviderToggle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('toggle_ai_provider');
      
      if (error) throw error;

      await refetch(); // Refresh the data after toggling

      toast.success("AI Provider Updated", {
        description: `Switched to ${data} API`,
      });
    } catch (error) {
      toast.error("Failed to toggle AI provider");
      console.error('Toggle error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Toggle dark mode theme
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
          />
        </div>

        {userSettings?.isAdmin && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-provider">AI Provider</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between DeepSeek and OpenAI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {userSettings.aiProvider === 'openai' ? 'OpenAI' : 'DeepSeek'}
              </span>
              <Switch
                id="ai-provider"
                checked={userSettings.aiProvider === 'openai'}
                onCheckedChange={handleProviderToggle}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};