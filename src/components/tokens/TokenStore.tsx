import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TokenStore = () => {
  const { data: packages } = useQuery({
    queryKey: ["tokenPackages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_packages")
        .select("*")
        .order("token_amount", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const handlePurchase = async (packageId: string) => {
    // TODO: Implement Stripe integration
    toast.info("Payment integration coming soon!");
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {packages?.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                ${pkg.price_usd}
              </div>
              <p className="text-sm text-muted-foreground">
                {pkg.token_amount.toLocaleString()} tokens
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => handlePurchase(pkg.id)}
            >
              Purchase
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TokenStore;