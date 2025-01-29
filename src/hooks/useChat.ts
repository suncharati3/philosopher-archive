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
    try {
      // First verify the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      // Verify user has access to this conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (convError || !conversation) {
        throw new Error("Unauthorized access to conversation");
      }

      // Fetch messages with error handling
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        if (error.message.includes("JWT")) {
          throw new Error("Session expired");
        }
        throw error;
      }

      setMessages(data || []);
    } catch (error: any) {
      console.error("Error in fetchMessages:", error);
      if (error.message === "No active session" || error.message === "Session expired") {
        toast.error("Session expired. Please sign in again.");
        throw new Error("auth/sign-in-required");
      } else if (error.message === "Unauthorized access to conversation") {
        toast.error("You don't have access to this conversation");
        throw new Error("auth/unauthorized");
      } else {
        toast.error("Failed to load messages. Please try again.");
        throw error;
      }
    }
  };

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    shouldSave: boolean
  ) => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return null;

    setIsLoading(true);
    let currentConversationId = conversationId;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please sign in again.");
        throw new Error("auth/sign-in-required");
      }

      // Add user message to UI immediately
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      if (shouldSave) {
        if (!currentConversationId) {
          currentConversationId = await createConversation();
          if (!currentConversationId) {
            throw new Error("Failed to create conversation");
          }
        }

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
          throw new Error("Failed to save message");
        }

        if (savedMessage) {
          setMessages(prev =>
            prev.map((msg) =>
              msg.id === tempUserMessage.id ? savedMessage : msg
            )
          );
        }
      }

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { 
          message, 
          philosopher: selectedPhilosopher,
          messageHistory: messages.map(msg => ({
            role: msg.is_ai ? 'assistant' : 'user',
            content: msg.content
          }))
        },
      });

      if (response.error) {
        console.error("Error getting AI response:", response.error);
        throw new Error("Failed to get AI response");
      }

      const aiMessage = {
        id: `temp-ai-${Date.now()}`,
        content: response.data.response,
        is_ai: true,
        created_at: new Date().toISOString(),
      };

      if (shouldSave && currentConversationId) {
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
          throw new Error("Failed to save AI response");
        }

        if (savedAiMessage) {
          setMessages(prev => [...prev, savedAiMessage]);
        }
      } else {
        setMessages(prev => [...prev, aiMessage]);
      }

      return currentConversationId;
    } catch (error: any) {
      console.error("Error in sendMessage:", error);
      if (error.message === "auth/sign-in-required") {
        toast.error("Session expired. Please sign in again.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
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