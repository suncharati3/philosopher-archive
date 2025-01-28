import { Star } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useChatMode } from "@/hooks/useChatMode";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {concepts.map((concept, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="px-4 py-2 text-base bg-primary/5 text-primary border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => handleConceptClick(concept)}
          >
            {concept}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {keyIdeas.map((idea, index) => (
          <Card 
            key={index} 
            className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleIdeaClick(idea)}
          >
            <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
              <h4 className="font-semibold text-lg text-primary mb-3">{idea.title}</h4>
              <p className="text-muted-foreground leading-relaxed line-clamp-3">{idea.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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