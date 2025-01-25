import { useEffect, useState } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

interface Message {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  created_at: string;
}

const ChatInterface = () => {
  const { selectedPhilosopher } = usePhilosophersStore();
  const [message, setMessage] = useState("");
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const debouncedMessage = useDebounce(message, 2000);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("philosopher_id", selectedPhilosopher?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching conversations",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setConversations(data);
    if (data.length > 0 && !selectedConversation) {
      setSelectedConversation(data[0].id);
    }
  };

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
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        philosopher_id: selectedPhilosopher?.id,
        mode: isPublicMode ? "public" : "confession",
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

    await fetchConversations();
    return data.id;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    let currentConversationId = selectedConversation;

    if (!currentConversationId) {
      currentConversationId = await createConversation();
      if (!currentConversationId) {
        setIsLoading(false);
        return;
      }
    }

    if (!isPublicMode) {
      // Handle ephemeral messages in confession mode
      setMessages([
        ...messages,
        {
          id: Math.random().toString(),
          content: message,
          is_ai: false,
          created_at: new Date().toISOString(),
        },
      ]);
      setMessage("");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: currentConversationId,
      content: message,
      is_ai: false,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setMessage("");
    await fetchMessages(currentConversationId);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Switch
              id="public-mode"
              checked={isPublicMode}
              onCheckedChange={setIsPublicMode}
            />
            <Label htmlFor="public-mode">Public Mode</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isPublicMode
              ? "Messages will be saved"
              : "Confession mode - messages won't be saved"}
          </p>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                selectedConversation === conversation.id ? "bg-muted" : ""
              }`}
            >
              <p className="text-sm">
                {new Date(conversation.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_ai ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.is_ai
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;