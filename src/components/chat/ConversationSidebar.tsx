import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { MessageSquarePlus } from "lucide-react";
import { useAuth } from "@/lib/auth";

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
  setSelectedConversation: (id: string) => void;
}

const ConversationSidebar = ({
  isPublicMode,
  setIsPublicMode,
  selectedConversation,
  setSelectedConversation,
}: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { selectedPhilosopher } = usePhilosophersStore();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchConversations = async () => {
    try {
      if (!user || !selectedPhilosopher) {
        console.log("No user or philosopher selected");
        return;
      }

      // First, get all conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("*")
        .eq("philosopher_id", selectedPhilosopher.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
        toast({
          title: "Error fetching conversations",
          description: conversationsError.message,
          variant: "destructive",
        });
        return;
      }

      if (!conversationsData) {
        console.log("No conversations found");
        setConversations([]);
        return;
      }

      // Then, for each conversation, get its first message
      const conversationsWithMessages = await Promise.all(
        conversationsData.map(async (conversation) => {
          try {
            const { data: messages, error: messagesError } = await supabase
              .from("messages")
              .select("content, created_at")
              .eq("conversation_id", conversation.id)
              .order("created_at", { ascending: true })
              .limit(1)
              .single();

            if (messagesError && messagesError.code !== "PGRST116") {
              console.error("Error fetching message:", messagesError);
            }

            return {
              ...conversation,
              first_message: messages || null,
            };
          } catch (error) {
            console.error("Error processing conversation:", error);
            return conversation;
          }
        })
      );

      console.log("Setting conversations:", conversationsWithMessages);
      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error in fetchConversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user && selectedPhilosopher) {
      console.log("Fetching conversations for:", selectedPhilosopher.id);
      fetchConversations();
    }
  }, [user, selectedPhilosopher?.id, selectedConversation]);

  const formatPreview = (content: string) => {
    return content?.length > 40 ? content.substring(0, 40) + "..." : content;
  };

  const handleNewConversation = () => {
    setSelectedConversation(null);
    setIsPublicMode(true);
  };

  return (
    <div className="w-64 border-r border-border bg-muted/30">
      <div className="p-4 border-b">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleNewConversation}
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => {
              setSelectedConversation(conversation.id);
              setIsPublicMode(true);
            }}
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