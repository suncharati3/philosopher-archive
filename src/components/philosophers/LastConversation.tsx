import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";

interface LastConversationProps {
  showLastConversation: boolean;
}

const LastConversation = ({ showLastConversation }: LastConversationProps) => {
  const navigate = useNavigate();
  const { philosophers, setSelectedPhilosopher } = usePhilosophersStore();
  const [lastConversation, setLastConversation] = useState<any>(null);

  useEffect(() => {
    const fetchLastConversation = async () => {
      if (!showLastConversation) {
        setLastConversation(null);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          philosophers:philosopher_id(name),
          messages:messages(content)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastConversation(data);
      }
    };

    fetchLastConversation();
  }, [showLastConversation]);

  const handleLastConversationClick = () => {
    if (lastConversation) {
      const philosopher = philosophers.find(p => p.id === lastConversation.philosopher_id);
      if (philosopher) {
        setSelectedPhilosopher(philosopher);
        navigate(`/philosophers/${philosopher.id}/chat`);
      }
    }
  };

  if (!showLastConversation || !lastConversation) return null;

  return (
    <Button
      variant="ghost"
      className="w-full p-4 mt-4 border-t border-border/40 text-left flex flex-col items-start hover:bg-accent"
      onClick={handleLastConversationClick}
    >
      <div className="flex items-center gap-2 text-sm font-medium mb-2">
        <MessageCircle className="w-4 h-4" />
        <span>Last Conversation</span>
      </div>
      <div className="text-sm text-muted-foreground w-full">
        <p className="font-medium">{lastConversation.philosophers?.name}</p>
        {lastConversation.messages?.[0]?.content && (
          <p className="truncate mt-1">
            {lastConversation.messages[0].content}
          </p>
        )}
        <p className="text-xs mt-1">
          {new Date(lastConversation.created_at).toLocaleDateString()}
        </p>
      </div>
    </Button>
  );
};

export default LastConversation;