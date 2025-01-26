import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import { supabase } from "@/integrations/supabase/client";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";
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

  // Effect to fetch the last conversation when component mounts
  useEffect(() => {
    const fetchLastConversation = async () => {
      if (!selectedPhilosopher) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the most recent conversation for this philosopher
      const { data: conversations, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("philosopher_id", selectedPhilosopher.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching last conversation:", error);
        return;
      }

      if (conversations && conversations.length > 0) {
        setSelectedConversation(conversations[0].id);
        setIsPublicMode(true);
      }
    };

    fetchLastConversation();
  }, [selectedPhilosopher?.id, setSelectedConversation, setIsPublicMode]);

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
    
    const conversationId = await sendMessage(
      message,
      selectedConversation,
      isPublicMode
    );

    // Only update selected conversation if we're in public mode
    if (conversationId && isPublicMode) {
      setSelectedConversation(conversationId);
    }
    setMessage("");
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