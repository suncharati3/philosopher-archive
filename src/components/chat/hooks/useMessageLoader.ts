import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useMessageLoader = (
  selectedConversation: string | null,
  isPublicMode: boolean,
  isFetching: boolean,
  setIsFetching: (value: boolean) => void,
  fetchMessages: (conversationId: string) => Promise<void>,
  clearMessages: () => void
) => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!selectedConversation) {
        clearMessages();
        if (isMounted) setIsFetching(false);
        return;
      }

      if (!isMounted) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No active session found");
          toast.error("Please sign in to view messages");
          navigate("/auth");
          return;
        }

        // First verify conversation access
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", selectedConversation)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (convError) {
          console.error("Error verifying conversation access:", convError);
          toast.error("Error loading conversation");
          if (isMounted) setIsFetching(false);
          return;
        }

        if (!conversation) {
          console.error("No conversation found or access denied for ID:", selectedConversation);
          toast.error("Conversation not found or access denied");
          if (isMounted) setIsFetching(false);
          return;
        }

        if (!isMounted) return;

        // Now fetch messages
        try {
          await fetchMessages(selectedConversation);
        } catch (messageError) {
          console.error("Error fetching messages:", messageError);
          if (isMounted) {
            toast.error("Failed to load messages");
            setIsFetching(false);
          }
        }
      } catch (error) {
        console.error("Error in loadMessages:", error);
        if (isMounted) {
          toast.error("Failed to load messages");
          setIsFetching(false);
        }
      }
    };

    if (selectedConversation && !isFetching) {
      setIsFetching(true);
      loadMessages();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages, navigate]);
};