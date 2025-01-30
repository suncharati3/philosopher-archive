import { useState } from "react";
import { useMessageFetching } from "./chat/useMessageFetching";
import { useMessageSending } from "./chat/useMessageSending";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { fetchMessages } = useMessageFetching(setMessages);
  const { sendMessage, isLoading } = useMessageSending(setMessages);

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages,
    clearMessages,
  };
};