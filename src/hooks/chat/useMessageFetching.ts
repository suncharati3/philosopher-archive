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

      // Fetch messages directly since conversation access was already verified
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      setMessages(data || []);
      
      if (data?.length === 0) {
        console.log("No messages found for conversation:", conversationId);
      } else {
        console.log("Successfully loaded messages:", data.length);
      }
    } catch (error: any) {
      console.error("Error in fetchMessages:", error);
      if (error.message === "No active session") {
        toast.error("Session expired. Please sign in again.");
        throw new Error("auth/sign-in-required");
      }
      throw error;
    }
  };

  return { fetchMessages };
};