import { useState, useEffect, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";
import { toast } from "sonner";
import { useAuthCheck } from "./chat/hooks/useAuthCheck";
import { useConversationManager } from "./chat/hooks/useConversationManager";
import { useMessageLoader } from "./chat/hooks/useMessageLoader";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, fetchMessages, clearMessages } = useChat();
  const {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  } = useChatMode();

  const { isCheckingAuth } = useAuthCheck();
  const { isFetching, setIsFetching } = useConversationManager(
    isCheckingAuth,
    isPublicMode,
    selectedConversation,
    setSelectedConversation
  );

  useMessageLoader(
    selectedConversation,
    isPublicMode,
    isFetching,
    setIsFetching,
    fetchMessages,
    clearMessages
  );

  const handleNewConversation = useCallback(() => {
    setSelectedConversation(null);
    clearMessages();
    setIsPublicMode(true);
    toast.success("Started a new conversation");
  }, [setSelectedConversation, clearMessages, setIsPublicMode]);

  const handleModeChange = (newMode: boolean) => {
    setIsPublicMode(newMode);
    if (!newMode) {
      setSelectedConversation(null);
      clearMessages();
      toast.info("Switched to private mode - messages won't be saved");
    } else {
      toast.info("Switched to public mode - messages will be saved");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const currentMessage = message;
    setMessage("");
    
    try {
      console.log("Sending message:", { isPublicMode, selectedConversation });
      
      if (!isPublicMode) {
        await sendMessage(currentMessage, null, false);
      } else {
        const conversationId = await sendMessage(
          currentMessage,
          selectedConversation,
          true
        );
        
        if (conversationId && !selectedConversation) {
          console.log("Setting new conversation ID:", conversationId);
          setSelectedConversation(conversationId);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setMessage(currentMessage);
    }
  };

  if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-full">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="flex h-full">
      {isPublicMode && (
        <ConversationSidebar
          isPublicMode={isPublicMode}
          setIsPublicMode={handleModeChange}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          onNewConversation={handleNewConversation}
        />
      )}
      <div className="flex flex-1 flex-col">
        <ChatHeader
          isPublicMode={isPublicMode}
          setIsPublicMode={handleModeChange}
          onNewConversation={handleNewConversation}
        />
        <MessageList 
          messages={messages} 
          isLoading={isLoading || isFetching} 
        />
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;