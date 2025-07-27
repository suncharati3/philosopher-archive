import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
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

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-[88px] right-4 z-30 rounded-full h-11 w-11 p-0 shadow-lg bg-background/95 backdrop-blur border-border/40 hover:bg-background/100"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] z-50">
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
  ) : null;
};

export default MobileChatSidebar;