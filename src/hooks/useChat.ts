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
  isNewMessage?: boolean;
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
    // Mark all fetched messages as not new (historical)
    const historicalMessages = (data || []).map(msg => ({ ...msg, isNewMessage: false }));
    setMessages(historicalMessages);
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error("Authentication required", {
          description: "Please sign in to send messages",
        });
        return null;
      }

      // Add user message to UI immediately
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
        isNewMessage: true,
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
          toast.error("Error saving message", {
            description: saveError.message,
          });
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
        console.error("Error getting response:", response.error);
        toast.error("Error getting response", {
          description: response.error.message,
        });
        return currentConversationId;
      }

      // Add AI response to messages
      const aiMessage = {
        id: `temp-ai-${Date.now()}`,
        content: response.data.response,
        is_ai: true,
        created_at: new Date().toISOString(),
        isNewMessage: true,
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
          toast.error("Error saving AI response", {
            description: aiSaveError.message,
          });
        } else if (savedAiMessage) {
          // Mark saved AI message as new for animation
          setMessages(prev => [...prev, { ...savedAiMessage, isNewMessage: true }]);
        }
      } else {
        // Just add AI response to UI without saving
        setMessages(prev => [...prev, aiMessage]);
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