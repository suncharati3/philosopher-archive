import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";
import { toast } from "sonner";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, fetchMessages, clearMessages } = useChat();
  const {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  } = useChatMode();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation && isPublicMode) {
        setIsFetching(true);
        try {
          console.log("Fetching messages for conversation:", selectedConversation);
          await fetchMessages(selectedConversation);
        } catch (error) {
          console.error("Error fetching messages:", error);
          toast.error("Failed to load messages. Please try refreshing the page.");
        } finally {
          setIsFetching(false);
        }
      } else if (selectedConversation) {
        // Only clear messages when switching modes with a selected conversation
        console.log("Clearing messages due to mode change");
        clearMessages();
      }
    };

    loadMessages();
  }, [selectedConversation, isPublicMode, fetchMessages, clearMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const currentMessage = message;
    setMessage(""); // Clear input immediately
    
    try {
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
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setMessage(currentMessage); // Restore message if failed
    }
  };

  return (
    <div className="flex h-full">
      {isPublicMode && (
        <ConversationSidebar
          isPublicMode={isPublicMode}
          setIsPublicMode={setIsPublicMode}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      )}
      <div className="flex flex-1 flex-col">
        <ChatHeader
          isPublicMode={isPublicMode}
          setIsPublicMode={setIsPublicMode}
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