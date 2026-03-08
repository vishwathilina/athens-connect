import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="surface-dark rounded-t-[2rem] mx-4 md:mx-8 mt-8">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Top Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Social */}
          <div>
            <h4 className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] font-medium mb-4">Social Media</h4>
            <div className="space-y-2">
              {["Instagram", "Facebook", "X", "TikTok", "LinkedIn", "YouTube"].map(s => (
                <a key={s} href="#" className="flex items-center gap-1 text-sm text-[hsl(var(--surface-dark-foreground))] hover:text-primary transition-colors">
                  {s} <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Clubs */}
          <div>
            <h4 className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] font-medium mb-4">CLUBS</h4>
            <div className="space-y-2">
              {["All Clubs", "Categories", "Featured", "New"].map(s => (
                <a key={s} href="#" className="block text-sm text-[hsl(var(--surface-dark-foreground)/0.8)] hover:text-[hsl(var(--surface-dark-foreground))] transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] font-medium mb-4">CONTACT</h4>
            <div className="space-y-2">
              {["Community", "Knowledge Base", "Support", "Help & FAQ"].map(s => (
                <a key={s} href="#" className="block text-sm text-[hsl(var(--surface-dark-foreground)/0.8)] hover:text-[hsl(var(--surface-dark-foreground))] transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] font-medium mb-4">LEARN</h4>
            <div className="space-y-2">
              {["About", "Policy", "Blog"].map(s => (
                <a key={s} href="#" className="block text-sm text-[hsl(var(--surface-dark-foreground)/0.8)] hover:text-[hsl(var(--surface-dark-foreground))] transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Big Text */}
        <div className="overflow-hidden">
          <h2 className="font-display text-[8rem] md:text-[14rem] lg:text-[18rem] font-bold leading-none text-primary/20 tracking-tighter select-none">
            ATHENS
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[hsl(var(--surface-dark-foreground)/0.15)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)]">© Copyright 2026, All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms & Conditions", "Support"].map(s => (
              <a key={s} href="#" className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] hover:text-[hsl(var(--surface-dark-foreground))] transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
