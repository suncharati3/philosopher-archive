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
        console.log("No conversation selected, clearing messages");
        clearMessages();
        if (isMounted) setIsFetching(false);
        return;
      }

      try {
        console.log("Starting to load messages for conversation:", selectedConversation);
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

        // Now fetch messages
        console.log("Found conversation, fetching messages:", conversation.id);
        try {
          await fetchMessages(selectedConversation);
          console.log("Successfully loaded messages for conversation:", selectedConversation);
        } catch (messageError) {
          console.error("Error fetching messages:", messageError);
          toast.error("Failed to load messages");
        }
      } catch (error) {
        console.error("Error in loadMessages:", error);
        toast.error("Failed to load messages");
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

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