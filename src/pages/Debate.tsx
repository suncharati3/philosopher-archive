
import React from "react";
import { useAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Claim = {
  id: string;
  content: string;
  votes_count: number;
  is_central_claim: boolean;
  user_id: string;
  created_at: string;
};

const Debate = () => {
  const { user } = useAuth();
  
  const { data: claims, isLoading } = useQuery({
    queryKey: ['debate-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_claims')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching claims:', error);
        throw error;
      }
      
      return data as Claim[];
    }
  });

  const handleVote = async (claimId: string) => {
    try {
      const { error } = await supabase
        .from('debate_votes')
        .insert({ claim_id: claimId, user_id: user?.id });

      if (error) throw error;
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Debate Arena</h1>
        <div className="flex items-center justify-center">
          <p>Loading debates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debate Arena</h1>
      
      {claims?.map((claim) => (
        <Card key={claim.id} className="mb-4 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-lg font-medium">{claim.content}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>{new Date(claim.created_at).toLocaleDateString()}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{claim.votes_count} votes</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(claim.id)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Vote
            </Button>
          </div>
        </Card>
      ))}

      {claims?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No debate claims yet. Be the first to start a discussion!</p>
        </div>
      )}
    </div>
  );
};

export default Debate;
