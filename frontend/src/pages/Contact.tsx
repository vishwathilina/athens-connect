import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">GET IN TOUCH</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            Contact Us.
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a question, suggestion, or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@athens.edu", href: "mailto:hello@athens.edu" },
              { icon: Phone, label: "Phone", value: "+94 11 544 5000", href: "tel:+94115445000" },
              { icon: MapPin, label: "Address", value: "NSBM Green University", href: "#" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="flex items-start gap-4 bg-secondary rounded-2xl p-6 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-secondary rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-background rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-background rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@university.edu"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-muted-foreground mb-1.5 block">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-background rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="What's this about?"
              />
            </div>
            <div className="mb-6">
              <label className="text-xs text-muted-foreground mb-1.5 block">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-background rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button type="submit" className="btn-primary text-sm">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
