import { useState } from "react";
import { useTokens } from "./useTokens";
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
  const { checkTokenBalance, deductTokens } = useTokens();
  const { createConversation, saveMessage } = useConversation();

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error fetching messages", {
        description: error.message,
      });
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    isPublicMode: boolean
  ) => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return;

    const hasBalance = await checkTokenBalance();
    if (!hasBalance) return null;

    setIsLoading(true);
    let currentConversationId = conversationId;

    try {
      if (!currentConversationId) {
        currentConversationId = await createConversation();
        if (!currentConversationId) {
          setIsLoading(false);
          return null;
        }
      }

      // Add user message to UI immediately
      const userMessage = {
        id: Math.random().toString(),
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      if (!isPublicMode) {
        setIsLoading(false);
        return currentConversationId;
      }

      // Save user message
      await saveMessage(currentConversationId, message, false);

      // Estimate input tokens
      const inputTokens = Math.ceil(message.length / 4);

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { message, philosopher: selectedPhilosopher },
      });

      if (response.error) throw new Error(response.error.message);

      // Estimate output tokens
      const outputTokens = Math.ceil(response.data.response.length / 4);

      // Deduct tokens
      const deductionSuccess = await deductTokens(
        inputTokens,
        outputTokens,
        'gpt-4',  // Changed from 'gpt-4o' to 'gpt-4'
        `Chat with ${selectedPhilosopher.name}`
      );

      if (!deductionSuccess) {
        throw new Error("Failed to deduct tokens");
      }

      // Save AI response
      await saveMessage(currentConversationId, response.data.response, true);

      // Fetch updated messages
      await fetchMessages(currentConversationId);
      return currentConversationId;
    } catch (error) {
      toast.error("Error sending message", {
        description: error.message,
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
  };
};