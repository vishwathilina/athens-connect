<<<<<<< HEAD
import { ArrowUpRight, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
=======
import { ArrowUpRight, Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
>>>>>>> e1ffc206dd9fe94cf2929b49e41fb913c960ce71
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
<<<<<<< HEAD

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };
=======
  const dropdownRef = useRef<HTMLDivElement>(null);
>>>>>>> e1ffc206dd9fe94cf2929b49e41fb913c960ce71

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate("/");
  };

  // Get initials from name
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Athens Connect Logo" className="h-8 w-auto" />
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
<<<<<<< HEAD
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
=======
            /* ── Profile Dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:border-primary/50 transition-colors"
              >
                {/* Avatar circle */}
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center select-none">
                  {initials}
                </span>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown panel */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4" /> My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </div>
>>>>>>> e1ffc206dd9fe94cf2929b49e41fb913c960ce71
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
<<<<<<< HEAD
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
=======

          {user ? (
            <div className="pt-4 border-t border-border space-y-3">
              {/* User info row */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="w-4 h-4" /> My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-destructive"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/signin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground text-center">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">Join Now</Link>
            </div>
          )}
>>>>>>> e1ffc206dd9fe94cf2929b49e41fb913c960ce71
        </div>
      )}
    </nav>
  );
};

export default Navbar;
