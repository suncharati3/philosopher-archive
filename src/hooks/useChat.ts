
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useConversation } from "./useConversation";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { toast } from "sonner";

export interface Message {
  id: string; // Changed from optional to required
  content: string;
  is_ai: boolean;
  created_at?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { createConversation, saveMessage } = useConversation();
  const { selectedPhilosopher } = usePhilosophersStore();
  
  // Reset messages when philosopher changes
  useEffect(() => {
    setMessages([]);
  }, [selectedPhilosopher]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    
    try {
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

      if (data) {
        setMessages(data.map(message => ({
          ...message,
          id: message.id || `temp-${Date.now()}-${Math.random()}` // Ensure all messages have an id
        })));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = async (
    content: string,
    conversationId: string | null,
    saveToDB: boolean
  ) => {
    if (!selectedPhilosopher) return null;
    
    setIsLoading(true);
    
    // Create optimistic user message with a temporary ID
    const userMessage: Message = {
      id: `temp-${Date.now()}-user`,
      content,
      is_ai: false,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    let currentConversationId = conversationId;
    
    try {
      // For public mode, handle conversation creation/storage
      if (saveToDB) {
        // Create a new conversation if needed
        if (!currentConversationId) {
          currentConversationId = await createConversation();
          if (!currentConversationId) {
            throw new Error("Failed to create conversation");
          }
        }
        
        // Save the user message
        await saveMessage(currentConversationId, content, false);
        
        // Fetch AI response from Edge Function
        const response = await supabase.functions.invoke("chat-with-philosopher", {
          body: {
            message: content,
            philosopherId: selectedPhilosopher.id,
            conversationId: currentConversationId,
          },
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        const data = response.data;
        
        if (data && data.message) {
          // Create AI message with temporary ID
          const aiMessage: Message = {
            id: `temp-${Date.now()}-ai`,
            content: data.message,
            is_ai: true,
          };
          
          setMessages((prev) => [...prev, aiMessage]);
          
          // Save AI message to the database
          await saveMessage(currentConversationId, data.message, true);
        }
      } else {
        // For confession mode (private), create in-memory only response
        const response = await supabase.functions.invoke("chat-with-philosopher", {
          body: {
            message: content,
            philosopherId: selectedPhilosopher.id,
            conversationId: null, // No conversation ID for private mode
          },
        });
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        const data = response.data;
        
        if (data && data.message) {
          const aiMessage: Message = {
            id: `temp-${Date.now()}-ai-private`,
            content: data.message,
            is_ai: true,
          };
          
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
      
      return currentConversationId;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: error.message,
      });
      return currentConversationId;
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
