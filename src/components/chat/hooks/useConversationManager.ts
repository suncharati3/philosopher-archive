import { useState, useEffect } from "react";
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
        if (isMounted) setIsFetching(false);
        return;
      }

      try {
        if (isMounted) setIsFetching(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        const { data: conversations, error: conversationError } = await supabase
          .from("conversations")
          .select("*")
          .eq("philosopher_id", selectedPhilosopher.id)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (conversationError) {
          console.error("Error fetching conversation:", conversationError);
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
      } finally {
        if (isMounted) {
          setIsFetching(false);
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