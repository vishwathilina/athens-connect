import Navbar from "@/components/Navbar";
import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome Back.</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your clubs and events.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@university.edu"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded accent-primary" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline text-xs">Forgot password?</a>
            </div>
            <button type="submit" className="btn-primary w-full justify-center text-sm" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign In"} <ArrowUpRight className="w-4 h-4" />
            </button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center surface-dark rounded-l-[2rem] m-4">
        <div className="text-center p-12">
          <h2 className="font-display text-6xl font-bold text-primary/30 mb-4">ATHENS</h2>
          <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] max-w-sm">
            Your gateway to campus life. Join clubs, attend events, and build connections that last a lifetime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
