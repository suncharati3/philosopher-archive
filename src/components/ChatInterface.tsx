import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, fetchMessages, clearMessages } = useChat();
  const { selectedPhilosopher } = usePhilosophersStore();
  const {
    isPublicMode,
    setIsPublicMode,
    selectedConversation,
    setSelectedConversation,
  } = useChatMode();
  const [isFetching, setIsFetching] = useState(false);

  // Fetch and select the most recent conversation when component mounts
  useEffect(() => {
    const fetchLatestConversation = async () => {
      if (!selectedConversation && isPublicMode && selectedPhilosopher) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: conversations, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("philosopher_id", selectedPhilosopher.id)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching latest conversation:", error);
          return;
        }

        if (conversations && conversations.length > 0) {
          setSelectedConversation(conversations[0].id);
        }
      }
    };

    fetchLatestConversation();
  }, [selectedConversation, isPublicMode, selectedPhilosopher, setSelectedConversation]);

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