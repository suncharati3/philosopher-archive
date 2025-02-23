import { useEffect, useState } from "react";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import CategoryToggle from "./philosophers/CategoryToggle";
import PhilosopherSearch from "./philosophers/PhilosopherSearch";
import PhilosopherList from "./philosophers/PhilosopherList";
import UserMenu from "./philosophers/UserMenu";
import { TokenBalanceDisplay } from "./tokens/TokenBalanceDisplay";
import { filterPhilosophers } from "@/utils/philosopher-utils";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const PhilosopherSidebar = () => {
  const navigate = useNavigate();
  const {
    philosophers,
    fetchPhilosophers,
    searchQuery,
    setSearchQuery,
    selectedPhilosopher,
    setSelectedPhilosopher,
    selectedCategory,
    setSelectedCategory,
  } = usePhilosophersStore();

  const [showLastConversation, setShowLastConversation] = useState(false);
  const [lastConversation, setLastConversation] = useState<any>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchPhilosophers();
  }, [fetchPhilosophers]);

  useEffect(() => {
    const fetchLastConversation = async () => {
      if (!showLastConversation) {
        setLastConversation(null);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          philosophers:philosopher_id(name),
          messages:messages(content)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastConversation(data);
      }
    };

    fetchLastConversation();
  }, [showLastConversation]);

  const filteredPhilosophers = filterPhilosophers(philosophers, {
    searchQuery: debouncedSearch,
    selectedCategory,
  });

  const handleLastConversationClick = () => {
    if (lastConversation) {
      const philosopher = philosophers.find(
        (p) => p.id === lastConversation.philosopher_id
      );
      if (philosopher) {
        setSelectedPhilosopher(philosopher);
        navigate(`/philosophers/${philosopher.id}/chat`);
      }
    }
  };

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      <SidebarHeader className="border-b border-border/40 p-4 space-y-4">
        <CategoryToggle
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showLastConversation={showLastConversation}
          onShowLastConversationChange={setShowLastConversation}
        />
        <PhilosopherSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </SidebarHeader>
      <SidebarContent>
        <PhilosopherList
          philosophers={filteredPhilosophers}
          selectedPhilosopher={selectedPhilosopher}
          onPhilosopherSelect={setSelectedPhilosopher}
        />

        {showLastConversation && lastConversation && (
          <Button
            variant="ghost"
            className="w-full p-4 mt-4 border-t border-border/40 text-left flex flex-col items-start hover:bg-accent"
            onClick={handleLastConversationClick}
          >
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <MessageCircle className="w-4 h-4" />
              <span>Last Conversation</span>
            </div>
            <div className="text-sm text-muted-foreground w-full">
              <p className="font-medium">
                {lastConversation.philosophers?.name}
              </p>
              {lastConversation.messages?.[0]?.content && (
                <p className="truncate mt-1">
                  {lastConversation.messages[0].content}
                </p>
              )}
              <p className="text-xs mt-1">
                {new Date(lastConversation.created_at).toLocaleDateString()}
              </p>
            </div>
          </Button>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4 space-y-4">
        <TokenBalanceDisplay />
        <Separator />
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export default PhilosopherSidebar;
