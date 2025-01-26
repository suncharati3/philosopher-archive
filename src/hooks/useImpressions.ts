import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useImpressions = (contentType: string, contentId: string) => {
  const { data: impressions, refetch } = useQuery({
    queryKey: ["impressions", contentType, contentId],
    queryFn: async () => {
      const { data: likes } = await supabase
        .from("impressions")
        .select("impression_type")
        .eq("content_type", contentType)
        .eq("content_id", contentId);
      
      return {
        likes: likes?.filter(i => i.impression_type === "like").length || 0,
        interactions: likes?.length || 0
      };
    }
  });

  const addImpression = useCallback(async (type: "like" | "view") => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return false;
    }

    const { error } = await supabase
      .from("impressions")
      .insert({
        content_type: contentType,
        content_id: contentId,
        impression_type: type,
        user_id: user.id
      });

    if (!error) {
      refetch();
    } else {
      console.error("Error adding impression:", error);
      toast.error("Failed to record your interaction");
    }
    return !error;
  }, [contentType, contentId, refetch]);

  return {
    likes: impressions?.likes || 0,
    interactions: impressions?.interactions || 0,
    addImpression
  };
};