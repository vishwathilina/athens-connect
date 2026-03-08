import Navbar from "@/components/Navbar";
import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const [form, setForm] = useState({ student_id: "", name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords don't match!");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ student_id: form.student_id, name: form.name, email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center surface-dark rounded-r-[2rem] m-4">
        <div className="text-center p-12">
          <h2 className="font-display text-6xl font-bold text-primary/30 mb-4">ATHENS</h2>
          <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] max-w-sm">
            Join 12,000+ students already connected through Athens. Discover clubs, attend events, and find your community.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Join Athens.</h1>
            <p className="text-sm text-muted-foreground">Create your account and start exploring campus life.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Student ID</label>
              <input
                type="text"
                required
                value={form.student_id}
                onChange={(e) => setForm(prev => ({ ...prev, student_id: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 20240001"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">University Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@university.edu"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center text-sm" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create Account"} <ArrowUpRight className="w-4 h-4" />
            </button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
