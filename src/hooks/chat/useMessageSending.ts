import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useConversation } from "../useConversation";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export const useMessageSending = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation } = useConversation();
  const { selectedPhilosopher } = usePhilosophersStore();

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    shouldSave: boolean
  ) => {
    if (!message.trim() || isLoading) return null;
    setIsLoading(true);
    let currentConversationId = conversationId;

    try {
      // Add user message to UI immediately
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please sign in again.");
        throw new Error("auth/sign-in-required");
      }

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

        if (saveError) throw new Error("Failed to save message");

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
          messageHistory: []
        },
      });

      if (!response.data) {
        throw new Error("Failed to get AI response");
      }

      const aiMessage: Message = {
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

        if (aiSaveError) throw new Error("Failed to save AI response");

        if (savedAiMessage) {
          setMessages(prev => [...prev, savedAiMessage]);
        }
      } else {
        setMessages(prev => [...prev, aiMessage]);
      }

      return currentConversationId;
    } catch (error: any) {
      console.error("Error in sendMessage:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};