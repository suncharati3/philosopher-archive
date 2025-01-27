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
    // Only fetch messages when in public mode and a conversation is selected
    if (selectedConversation && isPublicMode) {
      console.log("Fetching messages for conversation:", selectedConversation);
      fetchMessages(selectedConversation);
    } else {
      clearMessages();
    }
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Store the current message before clearing the input
    const currentMessage = message;
    setMessage(""); // Clear input immediately
    
    const conversationId = await sendMessage(
      currentMessage,
      selectedConversation,
      isPublicMode
    );

    // Only update selected conversation if we're in public mode
    if (conversationId && isPublicMode) {
      setSelectedConversation(conversationId);
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