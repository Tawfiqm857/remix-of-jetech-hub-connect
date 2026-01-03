import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/JE_Techhub_logo.png";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      if (!fullName.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(email, password, fullName);
      if (error) {
        let message = "Failed to create account. Please try again.";
        if (error.message.includes("already registered")) {
          message = "This email is already registered. Please sign in instead.";
        }
        toast({
          title: "Sign up failed",
          description: message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to JE Tech Hub!",
        });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        let message = "Invalid email or password.";
        if (error.message.includes("Invalid login")) {
          message = "Invalid email or password. Please try again.";
        }
        toast({
          title: "Sign in failed",
          description: message,
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 african-pattern opacity-10" />
      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-elevated">
        <CardHeader className="text-center">
          <img 
            src={logo} 
            alt="JE Tech Hub" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <CardTitle className="font-heading text-2xl">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignUp
              ? "Join JE Tech Hub and start learning"
              : "Sign in to continue your journey"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent hover:underline ml-1 font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="/" className="text-muted-foreground text-sm hover:text-foreground">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;