
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

  // Handle mode switching and conversation selection
  useEffect(() => {
    if (selectedConversation && isPublicMode) {
      console.log("Fetching messages for conversation:", selectedConversation);
      fetchMessages(selectedConversation);
    } else if (!isPublicMode || !selectedConversation) {
      // Clear messages when switching to confession mode or when no conversation is selected
      console.log("Clearing messages due to mode change or no conversation selected");
      clearMessages();
    }
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const currentMessage = message;
    setMessage(""); // Clear input immediately
    
    if (!isPublicMode) {
      // In confession mode, just add message to UI without saving to database
      await sendMessage(currentMessage, null, false);
    } else {
      // In public mode, handle conversation creation/update
      const conversationId = await sendMessage(
        currentMessage,
        selectedConversation,
        true
      );
      
      if (conversationId) {
        setSelectedConversation(conversationId);
      }
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className={`h-full ${isPublicMode ? "w-64" : "w-0"} transition-all duration-300 flex-shrink-0`}>
        {isPublicMode && (
          <ConversationSidebar
            isPublicMode={isPublicMode}
            setIsPublicMode={setIsPublicMode}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col w-full h-full overflow-hidden">
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
