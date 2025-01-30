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
    console.log("MessageLoader: Starting with", {
      selectedConversation,
      isPublicMode,
      isFetching
    });

    const loadMessages = async () => {
      if (!selectedConversation || !isPublicMode) {
        console.log("MessageLoader: Clearing messages due to conditions");
        clearMessages();
        if (isMounted) setIsFetching(false);
        return;
      }

      try {
        console.log("MessageLoader: Checking session");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log("MessageLoader: No active session");
          navigate("/auth");
          return;
        }

        console.log("MessageLoader: Verifying conversation access");
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", selectedConversation)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (convError) {
          console.error("MessageLoader: Error verifying conversation access:", convError);
          if (isMounted) {
            toast.error("Error accessing conversation");
          }
          return;
        }

        if (!conversation) {
          console.log("MessageLoader: No conversation found");
          if (isMounted) setIsFetching(false);
          return;
        }

        console.log("MessageLoader: Fetching messages for conversation:", selectedConversation);
        await fetchMessages(selectedConversation);
      } catch (error) {
        console.error("MessageLoader: Error loading messages:", error);
        if (isMounted) {
          toast.error("Failed to load messages");
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    if (!isFetching) {
      console.log("MessageLoader: Starting load");
      setIsFetching(true);
      loadMessages();
    }

    return () => {
      console.log("MessageLoader: Cleanup");
      isMounted = false;
    };
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages, navigate, isFetching, setIsFetching]);
};