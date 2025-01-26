import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

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
  const { toast } = useToast();

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessages(data || []);
  };

  const createConversation = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a conversation",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        philosopher_id: selectedPhilosopher?.id,
        mode: "public",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating conversation",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data.id;
  };

  const checkTokenBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: balance, error } = await supabase
      .rpc('get_user_token_balance', { user_id: user.id });

    if (error) {
      toast({
        title: "Error checking token balance",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    if (balance < 100) { // Minimum required tokens for a conversation
      toast({
        title: "Insufficient tokens",
        description: "Please purchase more tokens to continue chatting",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const deductTokens = async (inputTokens: number, outputTokens: number, modelType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: success, error } = await supabase
      .rpc('deduct_tokens', {
        p_user_id: user.id,
        p_input_tokens: inputTokens,
        p_output_tokens: outputTokens,
        p_model_type: modelType,
        p_description: `Chat with ${selectedPhilosopher?.name}`
      });

    if (error || !success) {
      toast({
        title: "Error deducting tokens",
        description: error?.message || "Insufficient tokens",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    isPublicMode: boolean
  ) => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return;

    // Check token balance before proceeding
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

      // Add user message to the UI immediately
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

      // Save user message to database
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: currentConversationId,
        content: message,
        is_ai: false,
      });

      if (messageError) throw messageError;

      // Estimate input tokens (rough estimate: 4 chars = 1 token)
      const inputTokens = Math.ceil(message.length / 4);

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { message, philosopher: selectedPhilosopher },
      });

      if (response.error) throw new Error(response.error.message);

      // Estimate output tokens (rough estimate: 4 chars = 1 token)
      const outputTokens = Math.ceil(response.data.response.length / 4);

      // Deduct tokens for the conversation
      const deductionSuccess = await deductTokens(inputTokens, outputTokens, 'gpt-4o');
      if (!deductionSuccess) {
        throw new Error("Failed to deduct tokens");
      }

      // Save AI response to database
      const { error: aiMessageError } = await supabase.from("messages").insert({
        conversation_id: currentConversationId,
        content: response.data.response,
        is_ai: true,
      });

      if (aiMessageError) throw aiMessageError;

      // Fetch updated messages
      await fetchMessages(currentConversationId);
      return currentConversationId;
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
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