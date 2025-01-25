import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface Conversation {
  id: string;
  created_at: string;
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

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view conversations",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("philosopher_id", selectedPhilosopher?.id)
      .eq("user_id", user.id)
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

  return (
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
  );
};

export default ConversationSidebar;