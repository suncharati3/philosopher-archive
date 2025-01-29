import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountSettingsCard } from "@/components/settings/AccountSettingsCard";
import { PreferencesCard } from "@/components/settings/PreferencesCard";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="space-y-6">
        <AccountSettingsCard />
        <PreferencesCard />
      </div>
    </div>
  );
};

export default Settings;