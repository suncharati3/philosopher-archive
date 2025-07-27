import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { MessageSquare, Plus } from "lucide-react";
import ConversationSidebar from "../chat/ConversationSidebar";

interface MobileChatSidebarProps {
  isPublicMode: boolean;
  setIsPublicMode: (value: boolean) => void;
  selectedConversation: string | null;
  setSelectedConversation: (id: string) => void;
}

const MobileChatSidebar = ({
  isPublicMode,
  setIsPublicMode,
  selectedConversation,
  setSelectedConversation
}: MobileChatSidebarProps) => {
  const isMobile = useIsMobile();

  if (!isMobile || !isPublicMode) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-20 right-4 z-40 rounded-full h-12 w-12 p-0 shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="border-b border-border/40">
          <DrawerTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <ConversationSidebar
            isPublicMode={isPublicMode}
            setIsPublicMode={setIsPublicMode}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileChatSidebar;