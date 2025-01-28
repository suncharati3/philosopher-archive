import { MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PhilosopherIdeasProps {
  concepts: string[];
  keyIdeas: { title: string; description: string }[];
}

const PhilosopherIdeas = ({ concepts, keyIdeas }: PhilosopherIdeasProps) => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<{ title: string; description: string } | null>(null);
  const { selectedPhilosopher } = usePhilosophersStore();
  const { sendMessage } = useChat();
  const { setSelectedConversation, setIsPublicMode } = useChatMode();
  const { toast } = useToast();

  const handleConceptClick = (concept: string) => {
    setSelectedConcept(concept);
  };

  const handleIdeaClick = (idea: { title: string; description: string }) => {
    setSelectedIdea(idea);
  };

  const handleChatAboutConcept = async () => {
    if (!selectedConcept || !selectedPhilosopher) return;

    try {
      setIsPublicMode(true);
      const message = `I would like to discuss the concept of "${selectedConcept}" in your philosophy. Can you explain this concept, its significance in your work, and how it relates to your broader philosophical framework?`;
      
      const conversationId = await sendMessage(message, null, true);
      
      if (conversationId) {
        setSelectedConversation(conversationId);
        
        toast({
          title: "Starting conversation",
          description: `Let's discuss ${selectedConcept} with ${selectedPhilosopher.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error starting conversation",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    }
    setSelectedConcept(null);
  };

  const handleChatAboutIdea = async () => {
    if (!selectedIdea || !selectedPhilosopher) return;

    try {
      setIsPublicMode(true);
      const message = `I would like to discuss your idea about "${selectedIdea.title}". Here's what I know about it: ${selectedIdea.description}. Can you elaborate on this idea and explain its importance in your philosophical work?`;
      
      const conversationId = await sendMessage(message, null, true);
      
      if (conversationId) {
        setSelectedConversation(conversationId);
        
        toast({
          title: "Starting conversation",
          description: `Let's discuss ${selectedIdea.title} with ${selectedPhilosopher.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error starting conversation",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    }
    setSelectedIdea(null);
  };

  // Combine concepts and key ideas into a unified format
  const allIdeas = [
    ...concepts.map(concept => ({
      title: concept,
      description: null,
      isMainConcept: true
    })),
    ...keyIdeas.map(idea => ({
      ...idea,
      isMainConcept: false
    }))
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {allIdeas.map((idea, index) => (
        <div
          key={index}
          onClick={() => idea.isMainConcept ? handleConceptClick(idea.title) : handleIdeaClick(idea)}
          className={`
            p-6 rounded-lg cursor-pointer transition-all duration-300
            ${idea.isMainConcept 
              ? 'bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10' 
              : 'bg-gradient-to-br from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10'
            }
          `}
        >
          <h3 className="text-lg font-semibold mb-2 text-primary">{idea.title}</h3>
          {idea.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{idea.description}</p>
          )}
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Click to discuss</span>
          </div>
        </div>
      ))}

      <Dialog open={!!selectedConcept} onOpenChange={() => setSelectedConcept(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedConcept}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Button 
              className="w-full" 
              onClick={handleChatAboutConcept}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat about this concept
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedIdea} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedIdea?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mt-2">{selectedIdea?.description}</p>
          <div className="mt-4">
            <Button 
              className="w-full" 
              onClick={handleChatAboutIdea}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat about this idea
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhilosopherIdeas;