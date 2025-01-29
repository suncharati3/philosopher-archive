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
        return;
      }

      if (isFetching) return;

      setIsFetching(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expired. Please sign in again.");
          navigate("/auth");
          return;
        }

        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", selectedConversation)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (convError || !conversation) {
          console.error("Error verifying conversation access:", convError);
          toast.error("You don't have access to this conversation");
          if (isMounted) {
            setIsFetching(false);
          }
          return;
        }

        await fetchMessages(selectedConversation);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages. Please try refreshing the page.");
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages, navigate, isFetching, setIsFetching]);
};