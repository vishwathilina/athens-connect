import { ArrowUpRight, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">A</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">ATHENS</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive("/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Home</Link>
          <Link to="/clubs" className={`text-sm font-medium transition-colors ${isActive("/clubs") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Clubs</Link>
          <Link to="/events" className={`text-sm font-medium transition-colors ${isActive("/events") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Events</Link>
          <Link to="/about" className={`text-sm font-medium transition-colors ${isActive("/about") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>About Us</Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-4 py-1.5 flex items-center gap-1">
            Contact Us <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Sign In</Link>
              <Link to="/signup" className="btn-primary text-sm">Join Now</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 space-y-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Home</Link>
          <Link to="/clubs" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Clubs</Link>
          <Link to="/events" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Events</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">About Us</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Contact Us</Link>
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground text-center">Dashboard</Link>
                <button onClick={handleLogout} className="btn-outline-dark text-sm justify-center">Log Out <LogOut className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground text-center">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
