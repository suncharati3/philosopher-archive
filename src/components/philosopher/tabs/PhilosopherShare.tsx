import { MessageSquareShare } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface PhilosopherShareProps {
  philosopherId: number;
  philosopherName: string;
}

const PhilosopherShare = ({ philosopherId, philosopherName }: PhilosopherShareProps) => {
  const [shareText, setShareText] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleShare = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share your thoughts about this philosopher.",
        variant: "destructive",
      });
      return;
    }

    if (!shareText.trim()) {
      toast({
        title: "Empty content",
        description: "Please write something before sharing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('impressions')
        .insert({
          user_id: user.id,
          content_type: 'philosopher',
          content_id: philosopherId.toString(),
          impression_type: 'share',
          content: shareText,
        });

      if (error) throw error;

      toast({
        title: "Shared successfully",
        description: "Your thoughts have been shared successfully!",
      });
      setShareText("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your thoughts. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Share Your Thoughts</h3>
          <p className="text-muted-foreground">
            What are your thoughts about {philosopherName}'s philosophy? Share your perspective or how their ideas have influenced you.
          </p>
        </div>
        <Textarea
          placeholder="Write your thoughts here..."
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
          className="min-h-[120px]"
        />
        <Button 
          onClick={handleShare}
          className="w-full sm:w-auto"
        >
          <MessageSquareShare className="mr-2 h-4 w-4" />
          Share Your Perspective
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhilosopherShare;