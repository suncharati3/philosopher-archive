import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Books from "@/pages/Books";
import Ideas from "@/pages/Ideas";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Suggestions from "@/pages/Suggestions";
import Tokens from "@/pages/Tokens";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/*"
        element={
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/ideas" element={<Ideas />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/suggestions" element={<Suggestions />} />
                  <Route path="/tokens" element={<Tokens />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        }
      />
    </Routes>
  );
};

export default AppRoutes;