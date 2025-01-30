import { useState } from "react";

export const useChatMode = () => {
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );

  const handleModeChange = (newMode: boolean) => {
    setIsPublicMode(newMode);
    if (!newMode) {
      // When switching to private mode, clear selected conversation
      setSelectedConversation(null);
    }
  };

  // Only switch to public mode when explicitly selecting a conversation
  const selectConversation = (conversationId: string | null) => {
    setSelectedConversation(conversationId);
    if (conversationId) {
      setIsPublicMode(true);
    }
  };

  return {
    isPublicMode,
    setIsPublicMode: handleModeChange,
    selectedConversation,
    setSelectedConversation: selectConversation,
  };
};