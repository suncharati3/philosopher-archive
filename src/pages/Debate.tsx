
import React from "react";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Plus, Trophy, Timer, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CreateClaimForm } from "@/components/debate/CreateClaimForm";
import { ClaimCard } from "@/components/debate/ClaimCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Claim = {
  id: string;
  content: string;
  votes_count: number;
  is_central_claim: boolean;
  user_id: string;
  created_at: string;
  category?: string;
  stance?: "for" | "against" | "neutral";
  supporting_evidence?: string;
  counter_arguments?: string;
  parent_id?: string;
  expires_at?: string;
  profile?: {
    username?: string;
    avatar_url?: string;
    display_name?: string;
  };
};

const Debate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  
  const { data: claims, isLoading, refetch } = useQuery({
    queryKey: ['debate-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debate_claims')
        .select(`
          *,
          profile:user_id (
            username,
            avatar_url,
            display_name
          )
        `)
        .order('votes_count', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching claims:', error);
        throw error;
      }
      
      return data as Claim[];
    }
  });

  const handleVote = async (claimId: string) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    try {
      const { error } = await supabase
        .from('debate_votes')
        .insert({ claim_id: claimId, user_id: user?.id });

      if (error) {
        if (error.code === '23505') {
          toast.error("You've already voted for this claim");
        } else {
          throw error;
        }
      } else {
        refetch();
        toast.success("Vote recorded successfully!");
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record vote. Please try again.");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  // Organize claims into a hierarchical structure
  const organizeClaimsHierarchy = (claims: Claim[] = []) => {
    const topLevelClaims = claims.filter(claim => !claim.parent_id);
    const claimsById = new Map(claims.map(claim => [claim.id, { ...claim, replies: [] }]));
    
    claims.forEach(claim => {
      if (claim.parent_id && claimsById.has(claim.parent_id)) {
        const parent = claimsById.get(claim.parent_id);
        if (parent && parent.replies) {
          parent.replies.push(claimsById.get(claim.id));
        }
      }
    });
    
    return topLevelClaims.map(claim => claimsById.get(claim.id));
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

  const organizedClaims = organizeClaimsHierarchy(claims);
  const sortedClaims = organizedClaims?.sort((a, b) => (b?.votes_count || 0) - (a?.votes_count || 0));
  const topVotedClaim = sortedClaims?.[0];
  const otherClaims = sortedClaims?.slice(1);

  const renderClaim = (claim: any, level = 0) => {
    return (
      <div key={claim.id} className={`ml-${level * 8}`}>
        <ClaimCard
          claim={claim}
          onVote={handleVote}
          refetch={refetch}
          isTopVoted={claim === topVotedClaim}
        />
        {claim.replies && claim.replies.length > 0 && (
          <div className="ml-8 mt-4 border-l-2 border-primary/20 pl-4 space-y-4">
            {claim.replies.map((reply: any) => renderClaim(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Debate Arena</h1>
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Claim
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateClaimForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {topVotedClaim && (
        <Card className="p-8 mb-8 bg-gradient-to-br from-yellow-50 via-yellow-100/20 to-amber-50 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-yellow-800">Top Voted Claim</h2>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Time remaining: Coming soon</span>
            </div>
          </div>
          {renderClaim(topVotedClaim)}
        </Card>
      )}
      
      <div className="space-y-6">
        {otherClaims?.map((claim) => renderClaim(claim))}

        {claims?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-600">
              No debate claims yet. Be the first to start a discussion!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debate;
