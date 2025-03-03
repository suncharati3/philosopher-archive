
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

export const useConversation = () => {
  const { selectedPhilosopher } = usePhilosophersStore();

  const createConversation = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to create a conversation",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        philosopher_id: selectedPhilosopher?.id,
        mode: "public",
        user_id: user.id,
        title: null, // Explicitly set title to null when creating a new conversation
      })
      .select()
      .single();

    if (error) {
      toast.error("Error creating conversation", {
        description: error.message,
      });
      return null;
    }

    return data.id;
  };

  const saveMessage = async (conversationId: string, content: string, isAi: boolean) => {
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      content,
      is_ai: isAi,
    });

    if (error) {
      toast.error("Error saving message", {
        description: error.message,
      });
      return false;
    }

    return true;
  };

  return {
    createConversation,
    saveMessage,
  };
};
