import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          toast.error("Authentication error. Please sign in again.");
          navigate("/auth");
          return;
        }

        if (!session) {
          console.log("No active session found during auth check");
          toast.error("Please sign in to continue");
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Failed to verify authentication. Please try again.");
        navigate("/auth");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isCheckingAuth };
};