import { useEffect, useState } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationSidebar from "./chat/ConversationSidebar";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import ChatHeader from "./chat/ChatHeader";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

const ChatInterface = () => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [message, setMessage] = useState("");
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const debouncedMessage = useDebounce(message, 2000);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessages(data || []);
  };

  const createConversation = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a conversation",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        philosopher_id: selectedPhilosopher?.id,
        mode: isPublicMode ? "public" : "confession",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating conversation",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data.id;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !selectedPhilosopher) return;

    setIsLoading(true);
    let currentConversationId = selectedConversation;

    try {
      if (!currentConversationId) {
        currentConversationId = await createConversation();
        if (!currentConversationId) {
          setIsLoading(false);
          return;
        }
        setSelectedConversation(currentConversationId);
      }

      // Add user message to the UI immediately
      const userMessage = {
        id: Math.random().toString(),
        content: message,
        is_ai: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setMessage("");

      if (!isPublicMode) {
        setIsLoading(false);
        return;
      }

      // Save user message to database
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: currentConversationId,
        content: message,
        is_ai: false,
      });

      if (messageError) throw messageError;

      // Get AI response
      const response = await supabase.functions.invoke('chat-with-philosopher', {
        body: { message, philosopher: selectedPhilosopher },
      });

      if (response.error) throw new Error(response.error.message);

      // Save AI response to database
      const { error: aiMessageError } = await supabase.from("messages").insert({
        conversation_id: currentConversationId,
        content: response.data.response,
        is_ai: true,
      });

      if (aiMessageError) throw aiMessageError;

      // Fetch updated messages
      await fetchMessages(currentConversationId);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <MessageList messages={messages} />
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