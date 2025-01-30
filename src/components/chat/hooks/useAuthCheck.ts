import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          toast.error("Authentication error");
          navigate("/auth");
          return;
        }

        if (!session) {
          console.log("No active session");
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Failed to verify authentication");
        navigate("/auth");
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && isMounted) {
        navigate("/auth");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isCheckingAuth };
};