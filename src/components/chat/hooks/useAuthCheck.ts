import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    console.log("AuthCheck: Starting auth check");

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthCheck: Error checking auth:", error);
          if (isMounted) {
            toast.error("Authentication error");
            navigate("/auth");
          }
          return;
        }

        if (!session) {
          console.log("AuthCheck: No active session");
          if (isMounted) {
            navigate("/auth");
          }
          return;
        }

        console.log("AuthCheck: Valid session found");
      } catch (error) {
        console.error("AuthCheck: Unexpected error:", error);
        if (isMounted) {
          toast.error("Failed to verify authentication");
          navigate("/auth");
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthCheck: Auth state changed", _event);
      if (!session && isMounted) {
        navigate("/auth");
      }
    });

    return () => {
      console.log("AuthCheck: Cleanup");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isCheckingAuth };
};