import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TokenBalanceDisplay = () => {
  const navigate = useNavigate();
  const { data: balance } = useQuery({
    queryKey: ["tokenBalance"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      
      const { data, error } = await supabase.rpc(
        'get_user_token_balance',
        { user_id: user.id }
      );
      if (error) throw error;
      return data;
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => navigate("/tokens")}
        >
          <Coins className="h-4 w-4" />
          {balance?.toLocaleString() || 0}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Available tokens - Click to manage</p>
      </TooltipContent>
    </Tooltip>
  );
};