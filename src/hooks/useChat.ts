import { useState } from "react";
import { useConversation } from "./useConversation";
import { supabase } from "@/integrations/supabase/client";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export const useChat = () => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation } = useConversation();

  const clearMessages = () => {
    setMessages([]);
  };

  const fetchMessages = async (conversationId: string) => {
    console.log("Fetching messages for conversation:", conversationId);
    
    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast.error("Authentication required", {
        description: "Please sign in to view messages",
      });
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages", {
        description: error.message,
      });
      return;
    }

    console.log("Fetched messages:", data);
    setMessages(data || []);
  };

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    isPublicMode: boolean
  ) => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return null;

    setIsLoading(true);
    let currentConversationId = conversationId;

    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error("Authentication required", {
          description: "Please sign in to send messages",
        });
        return null;
      }

      if (!currentConversationId) {
        currentConversationId = await createConversation();
        if (!currentConversationId) {
          setIsLoading(false);
          return null;
        }
      }

      // Add user message to UI immediately with a temporary ID
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);

      // Save user message
      const { data: savedMessage, error: saveError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversationId,
          content: message,
          is_ai: false,
        })
        .select()
        .single();

      if (saveError) {
        console.error("Error saving message:", saveError);
        toast.error("Error saving message", {
          description: saveError.message,
        });
        // Keep the temporary message visible even if save failed
        return currentConversationId;
      }

      // Update the temporary message with the saved one
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempUserMessage.id ? savedMessage : msg
        )
      );

      if (!isPublicMode) {
        setIsLoading(false);
        return currentConversationId;
      }

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { message, philosopher: selectedPhilosopher },
      });

      if (response.error) {
        console.error("Error getting response:", response.error);
        toast.error("Error getting response", {
          description: response.error.message,
        });
        return currentConversationId;
      }

      // Save AI response
      const { data: savedAiMessage, error: aiSaveError } = await supabase
        .from("messages")
        .insert({
          conversation_id: currentConversationId,
          content: response.data.response,
          is_ai: true,
        })
        .select()
        .single();

      if (aiSaveError) {
        console.error("Error saving AI message:", aiSaveError);
        toast.error("Error saving AI response", {
          description: aiSaveError.message,
        });
      } else if (savedAiMessage) {
        setMessages((prev) => [...prev, savedAiMessage]);
      }

      return currentConversationId;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Error sending message", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return conversationId;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages,
    clearMessages,
  };
};
