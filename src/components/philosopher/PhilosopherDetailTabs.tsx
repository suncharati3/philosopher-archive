import { Quote, Star, Award, AlertTriangle, MessageSquareShare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface PhilosopherDetailTabsProps {
  philosopher: {
    id: number;
    name: string;
    short_description: string;
    core_ideas: string;
    key_ideas: string;
    quotes: string;
    influences: string;
    controversies: string;
  };
}

const PhilosopherDetailTabs = ({ philosopher }: PhilosopherDetailTabsProps) => {
  const [shareText, setShareText] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const quotes = philosopher.quotes?.split('\n').filter(Boolean) || [];
  const concepts = philosopher.core_ideas?.split(',').map(concept => concept.trim()) || [];
  const keyIdeas = philosopher.key_ideas?.split(',').map(idea => {
    const [title, description] = idea.split(':').map(part => part.trim());
    return { title, description };
  }) || [];
  const influences = philosopher.influences?.split('\n') || [];
  const controversies = philosopher.controversies?.split('\n') || [];

  const handleShare = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share your thoughts about this philosopher.",
        variant: "destructive",
      });
      return;
    }

    if (!shareText.trim()) {
      toast({
        title: "Empty content",
        description: "Please write something before sharing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('impressions')
        .insert({
          user_id: user.id,
          content_type: 'philosopher',
          content_id: philosopher.id.toString(),
          impression_type: 'share',
          content: shareText,
        });

      if (error) throw error;

      toast({
        title: "Shared successfully",
        description: "Your thoughts have been shared successfully!",
      });
      setShareText("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your thoughts. Please try again.",
        variant: "destructive",
      });
    }
  };

return (
    <div className="space-y-8">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <p className="text-muted-foreground text-lg leading-relaxed">{philosopher.short_description}</p>
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent overflow-x-auto">
          <TabsTrigger value="ideas" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Star className="mr-2 h-4 w-4" />
            Key Ideas
          </TabsTrigger>
          <TabsTrigger value="quotes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Quote className="mr-2 h-4 w-4" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="legacy" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <Award className="mr-2 h-4 w-4" />
            Legacy
          </TabsTrigger>
          <TabsTrigger value="share" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
            <MessageSquareShare className="mr-2 h-4 w-4" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="mt-8">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              {concepts.map((concept, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="px-4 py-2 text-base bg-primary/5 text-primary border-primary/20"
                >
                  {concept}
                </Badge>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {keyIdeas.map((idea, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                    <h4 className="font-semibold text-lg text-primary mb-3">{idea.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="mt-8">
          <Carousel className="w-full">
            <CarouselContent>
              {quotes.map((quote, index) => (
                <CarouselItem key={index}>
                  <Card className="border-none shadow-md">
                    <CardContent className="flex aspect-[3/1] items-center justify-center p-12 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <Quote className="h-12 w-12 text-primary mx-auto opacity-50" />
                        <blockquote className="text-xl italic text-foreground leading-relaxed">
                          "{quote.trim()}"
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </TabsContent>

        <TabsContent value="legacy" className="mt-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Influences
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {influences.map((influence, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                    <p className="text-foreground leading-relaxed">{influence}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {controversies.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Controversies
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {controversies.map((controversy, index) => (
                  <Card key={index} className="border-none shadow-md">
                    <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                      <p className="text-foreground leading-relaxed">{controversy}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="share" className="mt-8">
          <Card className="border-none shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Share Your Thoughts</h3>
                <p className="text-muted-foreground">
                  What are your thoughts about {philosopher.name}'s philosophy? Share your perspective or how their ideas have influenced you.
                </p>
              </div>
              <Textarea
                placeholder="Write your thoughts here..."
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={handleShare}
                className="w-full sm:w-auto"
              >
                <MessageSquareShare className="mr-2 h-4 w-4" />
                Share Your Perspective
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhilosopherDetailTabs;
