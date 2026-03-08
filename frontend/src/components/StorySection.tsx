import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import clubMeeting from "@/assets/club-meeting.jpg";
import avatarStory from "@/assets/avatar-story.png";

const StorySection = () => {
  return (
    <section id="about" className="section-padding max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-20">
        {/* Left Tabs */}
        <div className="flex flex-col gap-3 shrink-0">
          <Link to="/about" className="tag-pill bg-foreground text-background text-sm inline-block text-center">Our Story</Link>
          <button className="tag-pill text-muted-foreground text-sm hover:text-foreground transition-colors">Activity</button>
          <Link to="/clubs" className="tag-pill text-muted-foreground text-sm hover:text-foreground transition-colors inline-block text-center">Find Clubs</Link>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Experience<br />
              Campus True Spirit
            </h2>
            <img src={avatarStory} alt="Student" className="w-14 h-14 rounded-full object-cover hidden md:block" />
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-3">Our Story</p>
              <p className="text-sm text-muted-foreground mb-6">Where Passion Meets Connection</p>
            </div>

            {/* Main Image Card */}
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={clubMeeting} alt="Club meeting" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display font-bold text-xl text-[hsl(var(--surface-dark-foreground))] mb-2">CLUBS FOR EVERYONE</h3>
                <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.7)] mb-4">From academics to athletics, arts to activism — find your tribe on campus.</p>
                <button className="btn-primary text-sm">
                  Get Started <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Side Tags */}
            <div className="flex flex-col gap-3">
              <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium text-foreground">Find your spark.</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
              <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium text-foreground">Explore the clubs.</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
              <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium text-foreground">Passion, Precision, Play...</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Where Students Connect.</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                We Are Here To Support Your Campus Journey, From Freshman To Senior. Explore Trusted Resources, A Vibrant Community...
              </p>
            </div>
            <button className="btn-outline-dark text-sm shrink-0">
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
