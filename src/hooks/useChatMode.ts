import { useState, useEffect } from "react";

export const useChatMode = () => {
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedConversation) {
      setIsPublicMode(true);
    }
  }, [selectedConversation]);

  return {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  };
};