import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export const useMessageFetching = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (convError || !conversation) {
        throw new Error("Unauthorized access to conversation");
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch (error: any) {
      console.error("Error in fetchMessages:", error);
      if (error.message === "No active session") {
        toast.error("Session expired. Please sign in again.");
        throw new Error("auth/sign-in-required");
      }
      toast.error("Failed to load messages");
      throw error;
    }
  };

  return { fetchMessages };
};