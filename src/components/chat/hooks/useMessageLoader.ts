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
        console.log("Loading messages for conversation:", selectedConversation);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No active session found");
          navigate("/auth");
          return;
        }

        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", selectedConversation)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (convError) {
          console.error("Error verifying conversation access:", convError);
          toast.error("Error loading conversation");
          return;
        }

        if (!conversation) {
          console.error("No conversation found or access denied for ID:", selectedConversation);
          if (isMounted) setIsFetching(false);
          return;
        }

        console.log("Found conversation, fetching messages:", conversation);
        await fetchMessages(selectedConversation);
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