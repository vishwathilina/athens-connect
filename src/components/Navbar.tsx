import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">A</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">ATHENS</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#clubs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Clubs</a>
          <a href="#events" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Events</a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About Us</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-4 py-1.5 flex items-center gap-1">
            Contact Us <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">Sign In</button>
          <button className="btn-primary text-sm">Join Now</button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 space-y-4">
          <a href="#" className="block text-sm font-medium text-foreground">Home</a>
          <a href="#clubs" className="block text-sm font-medium text-muted-foreground">Clubs</a>
          <a href="#events" className="block text-sm font-medium text-muted-foreground">Events</a>
          <a href="#about" className="block text-sm font-medium text-muted-foreground">About Us</a>
          <div className="pt-4 flex flex-col gap-3">
            <button className="text-sm font-medium text-foreground">Sign In</button>
            <button className="btn-primary text-sm justify-center">Join Now</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
