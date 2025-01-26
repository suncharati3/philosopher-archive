import { useState, useEffect } from "react";

export const useChatMode = () => {
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );

  // Ensure we stay in public mode when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setIsPublicMode(true);
    }
  }, [selectedConversation]);

  // Expose a function to set both the conversation and mode at once
  const selectConversation = (conversationId: string | null) => {
    setSelectedConversation(conversationId);
    if (conversationId) {
      setIsPublicMode(true);
    }
  };

  return {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation: selectConversation,
  };
};