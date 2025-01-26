import { SidebarFooter } from "@/components/ui/sidebar";
import { TokenBalanceDisplay } from "@/components/tokens/TokenBalanceDisplay";
import { Separator } from "@/components/ui/separator";
import UserMenu from "./UserMenu";

const PhilosopherSidebarFooter = () => {
  return (
    <SidebarFooter className="border-t border-border/40 p-4 space-y-4">
      <TokenBalanceDisplay />
      <Separator />
      <UserMenu />
    </SidebarFooter>
  );
};

export default PhilosopherSidebarFooter;