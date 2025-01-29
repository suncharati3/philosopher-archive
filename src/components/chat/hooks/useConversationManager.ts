import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

export const useConversationManager = (
  isCheckingAuth: boolean,
  isPublicMode: boolean,
  selectedConversation: string | null,
  setSelectedConversation: (id: string | null) => void
) => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestConversation = async () => {
      if (isCheckingAuth || !selectedPhilosopher || !isPublicMode || selectedConversation) {
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("No valid session for conversation fetch");
          toast.error("Please sign in to access conversations");
          navigate("/auth");
          return;
        }

        const { data: conversations, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("philosopher_id", selectedPhilosopher.id)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching latest conversation:", error);
          toast.error("Failed to load conversation");
          return;
        }

        if (conversations && isMounted) {
          setSelectedConversation(conversations.id);
        }
      } catch (error) {
        console.error("Error in fetchLatestConversation:", error);
        if (isMounted) {
          toast.error("Failed to load conversation");
        }
      }
    };

    fetchLatestConversation();

    return () => {
      isMounted = false;
    };
  }, [isCheckingAuth, selectedPhilosopher, isPublicMode, selectedConversation, navigate, setSelectedConversation]);

  return { isFetching, setIsFetching };
};