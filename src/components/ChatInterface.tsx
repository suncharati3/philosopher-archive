
import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileChatSidebar from "./mobile/MobileChatSidebar";
import MobileChatHeader from "./mobile/MobileChatHeader";
import MobileMessageInput from "./mobile/MobileMessageInput";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, fetchMessages, clearMessages } = useChat();
  const {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  } = useChatMode();
  const isMobile = useIsMobile();

  // Handle mode switching and conversation selection - prevent infinite loops
  useEffect(() => {
    if (selectedConversation && isPublicMode) {
      console.log("Loading conversation messages:", selectedConversation);
      fetchMessages(selectedConversation);
    } else if (!isPublicMode) {
      // Clear messages when switching to confession mode
      console.log("Clearing messages - switched to confession mode");
      clearMessages();
    }
  }, [selectedConversation, isPublicMode]); // Removed fetchMessages and clearMessages from deps

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || message;
    if (!textToSend.trim()) return;
    
    if (!msgText) {
      setMessage(""); // Clear input only if using state message
    }
    
    // Always save messages to database (removed confession mode complexity)
    const conversationId = await sendMessage(
      textToSend,
      selectedConversation,
      true
    );
    
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Desktop Layout */}
      {!isMobile && (
        <>
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
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          <div className="flex flex-1 flex-col w-full h-full overflow-hidden">
            <MobileChatHeader />
            
            <div className="flex-1 overflow-hidden pb-[88px]">
              <MessageList messages={messages} isLoading={isLoading} />
            </div>
          </div>

          {/* Fixed Mobile Input - Always at bottom */}
          <MobileMessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

          {/* Mobile Conversation Sidebar - Always show in public mode */}
          <MobileChatSidebar
            isPublicMode={true}
            setIsPublicMode={() => {}}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        </>
      )}
    </div>
  );
};

export default ChatInterface;
