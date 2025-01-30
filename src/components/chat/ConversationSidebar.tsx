import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { MessageSquarePlus } from "lucide-react";

interface Message {
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  created_at: string;
  first_message?: Message;
}

interface ConversationSidebarProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  onNewConversation: () => void;
}

const ConversationSidebar = ({
  isPublicMode,
  setIsPublicMode,
  selectedConversation,
  setSelectedConversation,
  onNewConversation,
}: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { selectedPhilosopher } = usePhilosophersStore();

  useEffect(() => {
    if (selectedPhilosopher) {
      fetchConversations();
    }
  }, [selectedPhilosopher?.id]);

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to view conversations");
      return;
    }

    const { data: conversationsData, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .eq("philosopher_id", selectedPhilosopher?.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (conversationsError) {
      toast.error("Error fetching conversations");
      return;
    }

    const conversationsWithMessages = await Promise.all(
      conversationsData.map(async (conversation) => {
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .eq("is_ai", false)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (messagesError && messagesError.code !== "PGRST116") {
          console.error("Error fetching message:", messagesError);
        }

        return {
          ...conversation,
          first_message: messages,
        };
      })
    );

    setConversations(conversationsWithMessages);
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    console.log("Selected conversation:", conversationId);
  };

  const formatPreview = (content: string) => {
    return content.length > 40 ? content.substring(0, 40) + "..." : content;
  };

  return (
    <div className="w-64 border-r border-border bg-muted/30">
      <div className="p-4 border-b">
        <Button
          variant="outline"
          className="w-full"
          onClick={onNewConversation}
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleConversationSelect(conversation.id)}
            className={`w-full p-4 text-left hover:bg-muted transition-colors ${
              selectedConversation === conversation.id ? "bg-muted" : ""
            }`}
          >
            <p className="text-sm font-medium">
              {conversation.first_message 
                ? formatPreview(conversation.first_message.content)
                : "New Conversation"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(conversation.created_at).toLocaleDateString()}
            </p>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;