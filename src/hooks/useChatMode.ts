import { useState } from "react";

export const useChatMode = () => {
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );

  // Only switch to public mode when explicitly selecting a conversation
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