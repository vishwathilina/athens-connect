import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Award, Heart, Target } from "lucide-react";
import heroCampus from "@/assets/hero-campus.jpg";
import clubMeeting from "@/assets/club-meeting.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">ABOUT US</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            Building The Future<br />Of Campus Life.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Athens is the premier platform connecting university students with clubs, events, and communities that shape their campus experience.
          </p>
        </div>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 mb-16">
          <img src={heroCampus} alt="Campus life" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark)/0.4)] to-transparent" />
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe that the university experience extends far beyond the classroom. Athens was created to make it effortless for students to discover, join, and participate in the vibrant tapestry of campus life. From academic societies to athletic teams, cultural organizations to social impact groups — we connect students with communities where they belong.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64">
            <img src={clubMeeting} alt="Club meeting" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Community", desc: "Building connections that last beyond graduation." },
              { icon: Award, title: "Excellence", desc: "Empowering students to achieve their highest potential." },
              { icon: Heart, title: "Inclusivity", desc: "Every student deserves a place where they belong." },
              { icon: Target, title: "Impact", desc: "Creating meaningful change on campus and beyond." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-secondary rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="surface-dark rounded-2xl p-10 md:p-16 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Active Clubs" },
              { value: "12k+", label: "Students" },
              { value: "200+", label: "Events/Year" },
              { value: "95%", label: "Satisfaction" },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
