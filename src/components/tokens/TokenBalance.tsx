import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface TokenBalanceProps {
  balance: number;
}

const TokenBalance = ({ balance }: TokenBalanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Token Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{balance.toLocaleString()}</div>
        <p className="text-sm text-muted-foreground">Available tokens</p>
      </CardContent>
    </Card>
  );
};

export default TokenBalance;