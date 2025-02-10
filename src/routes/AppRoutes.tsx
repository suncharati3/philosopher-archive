
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Tokens from "@/pages/Tokens";
import Suggestions from "@/pages/Suggestions";
import Ideas from "@/pages/Ideas";
import Books from "@/pages/Books";
import PhilosopherView from "@/components/PhilosopherView";
import Debate from "@/pages/Debate";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/auth"
      element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/tokens"
      element={
        <ProtectedRoute>
          <Tokens />
        </ProtectedRoute>
      }
    />
    <Route
      path="/suggestions"
      element={
        <ProtectedRoute>
          <Suggestions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ideas"
      element={
        <ProtectedRoute>
          <Ideas />
        </ProtectedRoute>
      }
    />
    <Route
      path="/books"
      element={
        <ProtectedRoute>
          <Books />
        </ProtectedRoute>
      }
    />
    <Route
      path="/debate"
      element={
        <ProtectedRoute>
          <Debate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/philosophers/:id/chat"
      element={
        <ProtectedRoute>
          <PhilosopherView view="chat" onViewChange={() => {}} />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
