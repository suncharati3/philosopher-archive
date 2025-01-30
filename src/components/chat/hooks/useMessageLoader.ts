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
          .single();

        if (convError) {
          console.error("Error verifying conversation access:", convError);
          if (isMounted) {
            toast.error("Error loading conversation");
            setIsFetching(false);
          }
          return;
        }

        if (!conversation) {
          console.error("No conversation found or access denied for ID:", selectedConversation);
          if (isMounted) {
            toast.error("Conversation not found or access denied");
            setIsFetching(false);
          }
          return;
        }

        // Now fetch messages
        await fetchMessages(selectedConversation);
        
        if (isMounted) {
          setIsFetching(false);
        }
      } catch (error) {
        console.error("Error in loadMessages:", error);
        if (isMounted) {
          toast.error("Failed to load messages");
          setIsFetching(false);
        }
      }
    };

    // Only start loading if we have a conversation and aren't already fetching
    if (selectedConversation && !isFetching) {
      console.log("Starting message load for conversation:", selectedConversation);
      setIsFetching(true);
      loadMessages();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages, navigate]);
};