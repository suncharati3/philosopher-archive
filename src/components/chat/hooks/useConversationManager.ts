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
    console.log("ConversationManager: Starting fetch with", {
      isCheckingAuth,
      isPublicMode,
      selectedConversation,
      philosopherId: selectedPhilosopher?.id
    });

    const fetchLatestConversation = async () => {
      // Skip if conditions aren't met
      if (isCheckingAuth || !selectedPhilosopher || !isPublicMode || selectedConversation) {
        console.log("ConversationManager: Skipping fetch due to conditions");
        if (isMounted) setIsFetching(false);
        return;
      }

      try {
        if (isMounted) setIsFetching(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("ConversationManager: No active session");
          navigate("/auth");
          return;
        }

        console.log("ConversationManager: Fetching conversation for", {
          philosopherId: selectedPhilosopher.id,
          userId: session.user.id
        });

        const { data: conversations, error: conversationError } = await supabase
          .from("conversations")
          .select("*")
          .eq("philosopher_id", selectedPhilosopher.id)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (conversationError) {
          console.error("ConversationManager: Error fetching conversation:", conversationError);
          if (isMounted) {
            toast.error("Failed to load conversation");
          }
          return;
        }

        console.log("ConversationManager: Fetch result:", conversations);

        if (conversations && isMounted) {
          setSelectedConversation(conversations.id);
        }
      } catch (error) {
        console.error("ConversationManager: Error in fetchLatestConversation:", error);
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