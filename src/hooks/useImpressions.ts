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

    // For "like" type, first check if the user has already liked this content
    if (type === "like") {
      const { data: existingLike } = await supabase
        .from("impressions")
        .select("id")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .eq("user_id", user.id)
        .eq("impression_type", "like")
        .maybeSingle();

      if (existingLike) {
        // If already liked, we could either show a message or remove the like
        toast.info("You've already liked this content");
        return false;
      }
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
      if (error.code === '23505') { // Unique constraint violation
        toast.info("You've already liked this content");
      } else {
        toast.error("Failed to record your interaction");
      }
    }
    return !error;
  }, [contentType, contentId, refetch]);

  return {
    likes: impressions?.likes || 0,
    interactions: impressions?.interactions || 0,
    addImpression
  };
};