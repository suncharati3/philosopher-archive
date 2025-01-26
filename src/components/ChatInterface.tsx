import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, fetchMessages, clearMessages } = useChat();
  const {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  } = useChatMode();

  useEffect(() => {
    // Immediately fetch messages when component mounts or conversation changes
    if (selectedConversation) {
      console.log("Fetching messages for conversation:", selectedConversation);
      fetchMessages(selectedConversation);
    } else {
      clearMessages();
    }
  }, [selectedConversation, fetchMessages, clearMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const conversationId = await sendMessage(
      message,
      selectedConversation,
      isPublicMode
    );
    if (conversationId) {
      setSelectedConversation(conversationId);
      setMessage("");
    }
  };

  return (
    <div className="flex h-full">
      <ConversationSidebar
        isPublicMode={isPublicMode}
        setIsPublicMode={setIsPublicMode}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
      <div className="flex flex-1 flex-col">
        <ChatHeader
          isPublicMode={isPublicMode}
          setIsPublicMode={setIsPublicMode}
        />
        <MessageList messages={messages} isLoading={isLoading} />
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