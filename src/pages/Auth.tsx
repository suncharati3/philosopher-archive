
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      // First try to sign in
      try {
        await signIn("demo@example.com", "testuser123");
        toast.success("Logged in as demo user!");
        return;
      } catch (signInError: any) {
        // If sign in fails, try to sign up first
        if (signInError.message.includes("Invalid email or password") || 
            signInError.message.includes("Invalid login credentials")) {
          try {
            await signUp("demo@example.com", "testuser123");
            toast.success("Demo user created! Please check your email to confirm, then try demo login again.");
            return;
          } catch (signUpError: any) {
            // If sign up also fails, the user might already exist but password is wrong
            if (signUpError.message.includes("already registered")) {
              toast.error("Demo user exists but password may be incorrect. Try manual login.");
            } else {
              throw signUpError;
            }
          }
        } else {
          throw signInError;
        }
      }
    } catch (error: any) {
      console.error("Test login error:", error);
      toast.error("Demo login failed. Please try manual login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, mode: "signin" | "signup") => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (mode === "signin") {
        await signIn(email, password);
        toast.success("Welcome back!");
      } else {
        await signUp(email, password);
        toast.success("Account created! You can now sign in.");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        throw new Error("Please enter your email address");
      }

      await resetPassword(email);
      toast.success("Password reset email sent. Please check your inbox.");
      // Switch back to sign-in view
      setResetPasswordMode(false);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WavyBackground
      className="w-full"
      colors={["#1a1f2c", "#6E59A5", "#9b87f5", "#7E69AB"]}
      backgroundFill="#1a1f2c"
      blur={2}
      speed="slow"
      waveWidth={100}
      waveOpacity={0.6}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              Welcome to Philosopher Archive
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Explore the wisdom of the ages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetPasswordMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Reset Password</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full" 
                    onClick={() => setResetPasswordMode(false)}
                    disabled={loading}
                  >
                    Back to Sign In
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="w-full text-sm" 
                        onClick={() => {
                          setResetPasswordMode(true);
                          setPassword("");
                        }}
                        disabled={loading}
                      >
                        Forgot password?
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-center mb-3">
                    <p className="text-sm text-muted-foreground">Want to try the app?</p>
                  </div>
                  <Button 
                    onClick={handleTestLogin} 
                    variant="outline" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Connecting..." : "🎭 Login as Demo User"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </WavyBackground>
  );
}
