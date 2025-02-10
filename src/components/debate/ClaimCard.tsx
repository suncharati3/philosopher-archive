
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreateClaimForm } from "./CreateClaimForm";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ClaimCardProps = {
  claim: {
    id: string;
    content: string;
    votes_count: number;
    created_at: string;
    category?: string;
    stance?: "for" | "against" | "neutral";
    supporting_evidence?: string;
    counter_arguments?: string;
    parent_id?: string;
  };
  onVote: (claimId: string) => void;
  refetch: () => void;
  isTopVoted?: boolean;
};

export const ClaimCard = ({ claim, onVote, refetch, isTopVoted = false }: ClaimCardProps) => {
  const [isReplying, setIsReplying] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { user } = useAuth();

  const handleReply = () => {
    if (!user) {
      toast.error("Please sign in to reply to claims");
      return;
    }
    setIsReplying(!isReplying);
  };

  const getStanceColor = (stance?: string) => {
    switch (stance) {
      case "for":
        return "bg-green-100 text-green-800";
      case "against":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-300 hover:shadow-lg",
        isTopVoted && "bg-gradient-to-br from-yellow-50 via-yellow-100/20 to-amber-50 border-yellow-200",
        claim.parent_id && "ml-8 border-l-4 border-l-primary/30"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {claim.category && (
                <Badge variant="outline">{claim.category}</Badge>
              )}
              {claim.stance && (
                <Badge className={getStanceColor(claim.stance)}>
                  {claim.stance}
                </Badge>
              )}
              {isTopVoted && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top Voted
                </Badge>
              )}
            </div>
            <p className={`${isTopVoted ? 'text-xl' : 'text-lg'} font-medium mb-2`}>{claim.content}</p>
            
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger className="text-sm text-blue-600 hover:text-blue-800">
                {isExpanded ? "Show less" : "Show more"}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                {claim.supporting_evidence && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Supporting Evidence</h4>
                    <p className="text-gray-600">{claim.supporting_evidence}</p>
                  </div>
                )}
                {claim.counter_arguments && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Counter Arguments</h4>
                    <p className="text-gray-600">{claim.counter_arguments}</p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span>{new Date(claim.created_at).toLocaleDateString()}</span>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{claim.votes_count} votes</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isTopVoted ? "default" : "outline"}
              size="sm"
              onClick={() => onVote(claim.id)}
              className={cn(
                "flex items-center gap-2",
                isTopVoted && "bg-primary hover:bg-primary/90"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              Vote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReply}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Reply
            </Button>
          </div>
        </div>

        {isReplying && (
          <div className="mt-4">
            <CreateClaimForm
              onSuccess={() => {
                setIsReplying(false);
                refetch();
              }}
              parentId={claim.id}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
