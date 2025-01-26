import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
    const { error } = await supabase
      .from("impressions")
      .insert({
        content_type: contentType,
        content_id: contentId,
        impression_type: type,
      });

    if (!error) {
      refetch();
    }
    return !error;
  }, [contentType, contentId, refetch]);

  return {
    likes: impressions?.likes || 0,
    interactions: impressions?.interactions || 0,
    addImpression
  };
};