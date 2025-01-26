import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TokenSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["tokenSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_token_settings")
        .select("*")
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const { data: packages } = useQuery({
    queryKey: ["tokenPackages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_packages")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("user_token_settings")
        .upsert({ user_id: user.id, ...newSettings });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokenSettings"] });
      toast.success("Settings updated successfully");
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    updateSettings.mutate({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={settings?.notifications_enabled}
              onCheckedChange={(checked) =>
                handleSettingChange("notifications_enabled", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowBalance">Low Balance Threshold</Label>
            <Input
              id="lowBalance"
              type="number"
              value={settings?.low_balance_threshold || 100}
              onChange={(e) =>
                handleSettingChange("low_balance_threshold", parseInt(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalBalance">Critical Balance Threshold</Label>
            <Input
              id="criticalBalance"
              type="number"
              value={settings?.critical_balance_threshold || 20}
              onChange={(e) =>
                handleSettingChange("critical_balance_threshold", parseInt(e.target.value))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoPurchase">Enable Auto-Purchase</Label>
            <Switch
              id="autoPurchase"
              checked={settings?.auto_purchase_enabled}
              onCheckedChange={(checked) =>
                handleSettingChange("auto_purchase_enabled", checked)
              }
            />
          </div>

          {settings?.auto_purchase_enabled && (
            <div className="space-y-2">
              <Label htmlFor="autoPackage">Auto-Purchase Package</Label>
              <Select
                value={settings?.auto_purchase_package_id}
                onValueChange={(value) =>
                  handleSettingChange("auto_purchase_package_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages?.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.token_amount} tokens
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenSettings;