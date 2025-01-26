import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTokens = () => {
  const checkTokenBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: balance, error } = await supabase
      .rpc('get_user_token_balance', { user_id: user.id });

    if (error) {
      toast.error("Error checking token balance", {
        description: error.message,
      });
      return false;
    }

    if (balance < 100) {
      toast.error("Insufficient tokens", {
        description: "Please purchase more tokens to continue chatting",
      });
      return false;
    }

    return true;
  };

  const deductTokens = async (inputTokens: number, outputTokens: number, modelType: string, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: success, error } = await supabase
      .rpc('deduct_tokens', {
        p_user_id: user.id,
        p_input_tokens: inputTokens,
        p_output_tokens: outputTokens,
        p_model_type: modelType,
        p_description: description
      });

    if (error || !success) {
      toast.error("Error deducting tokens", {
        description: error?.message || "Insufficient tokens",
      });
      return false;
    }

    return true;
  };

  return {
    checkTokenBalance,
    deductTokens,
  };
};