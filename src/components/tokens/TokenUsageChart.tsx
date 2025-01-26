import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const TokenUsageChart = () => {
  const { data: usage } = useQuery({
    queryKey: ["tokenUsage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_transactions")
        .select("*")
        .eq("transaction_type", "usage")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const groupedData = data.reduce((acc: any, curr) => {
        const modelType = curr.model_type || "unknown";
        if (!acc[modelType]) acc[modelType] = 0;
        acc[modelType] += curr.amount;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={usage}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart;