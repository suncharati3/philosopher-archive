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

  const sendMessage = async (
    message: string,
    conversationId: string | null,
    isPublicMode: boolean
  ) => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return;

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

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { message, philosopher: selectedPhilosopher },
      });

      if (response.error) throw new Error(response.error.message);

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