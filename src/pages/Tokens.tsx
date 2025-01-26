import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenBalance from "@/components/tokens/TokenBalance";
import TransactionHistory from "@/components/tokens/TransactionHistory";
import TokenStore from "@/components/tokens/TokenStore";
import TokenSettings from "@/components/tokens/TokenSettings";
import TokenUsageChart from "@/components/tokens/TokenUsageChart";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Tokens = () => {
  const navigate = useNavigate();
  const { data: tokenBalance } = useQuery({
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
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TokenBalance balance={tokenBalance || 0} />
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenUsageChart />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="store">Token Store</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <TransactionHistory />
        </TabsContent>
        <TabsContent value="store">
          <TokenStore />
        </TabsContent>
        <TabsContent value="settings">
          <TokenSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tokens;