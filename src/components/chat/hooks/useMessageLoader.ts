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
      if (!selectedConversation || !isPublicMode) {
        clearMessages();
        if (isMounted) setIsFetching(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
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
          return;
        }

        if (!conversation) {
          if (isMounted) setIsFetching(false);
          return;
        }

        await fetchMessages(selectedConversation);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        if (isMounted) {
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