
import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { MessageSquarePlus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  created_at: string;
  title?: string;
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
  const { toast: uiToast } = useToast();
  
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isPublicMode && selectedPhilosopher?.id) {
      fetchConversations();
    }
  }, [selectedConversation, selectedPhilosopher?.id, isPublicMode]); 

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      uiToast({
        title: "Authentication required",
        description: "Please sign in to view conversations",
        variant: "destructive",
      });
      return;
    }

    const { data: conversationsData, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .eq("philosopher_id", selectedPhilosopher?.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (conversationsError) {
      uiToast({
        title: "Error fetching conversations",
        description: conversationsError.message,
        variant: "destructive",
      });
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
          .single();

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

  const formatPreview = (content: string) => {
    return content.length > 40 ? content.substring(0, 40) + "..." : content;
  };

  const handleNewConversation = () => {
    setSelectedConversation(null);
    setIsPublicMode(true);
  };

  const handleRenameClick = (e: React.MouseEvent, conversationId: string, currentTitle?: string) => {
    e.stopPropagation();
    setEditingConversationId(conversationId);
    setNewTitle(currentTitle || "");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleRenameSubmit = async () => {
    if (!editingConversationId) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      toast.error("Title cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("conversations")
      .update({ title: trimmedTitle })
      .eq("id", editingConversationId)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to rename conversation", {
        description: error.message
      });
    } else {
      toast.success("Conversation renamed successfully");
      setConversations(prev => 
        prev.map(conv => 
          conv.id === editingConversationId ? { ...conv, title: trimmedTitle } : conv
        )
      );
    }
    setEditingConversationId(null);
  };

  const handleCancelRename = () => {
    setEditingConversationId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      console.log("Deleting messages for conversation:", conversationToDelete);
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationToDelete);

      if (messagesError) {
        console.error("Error deleting messages:", messagesError);
        toast.error("Failed to delete conversation messages", {
          description: messagesError.message
        });
        setDeleteDialogOpen(false);
        return;
      }

      console.log("Deleting conversation:", conversationToDelete);
      const { error: conversationError } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationToDelete)
        .eq("user_id", user.id);

      if (conversationError) {
        console.error("Error deleting conversation:", conversationError);
        toast.error("Failed to delete conversation", {
          description: conversationError.message
        });
      } else {
        toast.success("Conversation deleted successfully");
        
        // Update local state to remove the deleted conversation
        setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete));
        
        // If the deleted conversation was selected, clear the selection
        if (selectedConversation === conversationToDelete) {
          setSelectedConversation(null);
        }
      }
    } catch (error) {
      console.error("Exception during deletion:", error);
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  return (
    <div className="w-64 h-full border-r border-border bg-muted/30 flex flex-col overflow-hidden">
      <div className="p-4 border-b flex-shrink-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleNewConversation}
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={`relative w-full border-b border-border/40 hover:bg-muted transition-colors ${
              selectedConversation === conversation.id ? "bg-muted" : ""
            }`}
          >
            {editingConversationId === conversation.id ? (
              <div className="p-3 flex items-center">
                <Input 
                  ref={inputRef}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 text-sm mr-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit();
                    if (e.key === 'Escape') handleCancelRename();
                  }}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={handleRenameSubmit} className="h-8 w-8">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={handleCancelRename} className="h-8 w-8">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <button
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full p-4 text-left group"
              >
                <p className="text-sm font-medium pr-14">
                  {conversation.title || 
                    (conversation.first_message 
                      ? formatPreview(conversation.first_message.content)
                      : "New Conversation")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(conversation.created_at).toLocaleDateString()}
                </p>
                <div className="absolute top-3 right-2 opacity-100 flex z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => handleRenameClick(e, conversation.id, conversation.title)} 
                          className="h-7 w-7"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Rename</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => handleDeleteClick(e, conversation.id)} 
                          className="h-7 w-7"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </button>
            )}
          </div>
        ))}
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationSidebar;
