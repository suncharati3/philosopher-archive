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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        toast.error("Authentication required. Please sign in again.");
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        if (error.message.includes("JWT")) {
          toast.error("Session expired. Please sign in again.");
          return;
        }
        toast.error("Error loading messages. Please try again.");
        return;
      }

      console.log("Fetched messages successfully:", data);
      setMessages(data || []);
    } catch (error) {
      console.error("Unexpected error fetching messages:", error);
      toast.error("Failed to load messages. Please refresh the page.");
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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Authentication required. Please sign in again.");
        return null;
      }

      // Add user message to UI immediately
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      // Save to database if in public mode
      if (shouldSave) {
        if (!currentConversationId) {
          currentConversationId = await createConversation();
          if (!currentConversationId) {
            setIsLoading(false);
            return null;
          }
        }

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
          toast.error("Failed to save message. Please try again.");
          return currentConversationId;
        }

        // Update the temporary message with the saved one
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
        toast.error("Failed to get AI response. Please try again.");
        return currentConversationId;
      }

      // Add AI response to messages
      const aiMessage = {
        id: `temp-ai-${Date.now()}`,
        content: response.data.response,
        is_ai: true,
        created_at: new Date().toISOString(),
      };

      if (shouldSave && currentConversationId) {
        // Save AI response to database
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
          toast.error("Failed to save AI response.");
        } else if (savedAiMessage) {
          setMessages(prev => [...prev, savedAiMessage]);
        }
      } else {
        setMessages(prev => [...prev, aiMessage]);
      }

      return currentConversationId;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message. Please try again.");
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