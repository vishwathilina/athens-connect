import { ArrowUpRight, MapPin, Calendar, Users } from "lucide-react";
import heroCampus from "@/assets/hero-campus.jpg";

const HeroSection = () => {
  return (
    <section className="relative pt-20">
      <div className="relative h-[85vh] min-h-[600px] overflow-hidden rounded-b-[2rem] mx-4 md:mx-8">
        {/* Background Image */}
        <img
          src={heroCampus}
          alt="University campus with students"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.4)] to-transparent" />

        {/* Floating Cards */}
        <div className="absolute top-8 left-8 bg-background/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hidden md:block animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Campus Central, University Ave</span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Saturday</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Open to all</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="tag-pill bg-primary text-primary-foreground text-xs">4k+</span>
            <span className="text-xs text-muted-foreground">12:00 AM</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                WELCOME TO ATHENS
              </span>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[hsl(var(--surface-dark-foreground))] leading-[1.05]">
                Take Your Campus<br />
                Life To The<br />
                Next Level.
              </h1>
              <p className="mt-4 text-sm md:text-base text-[hsl(var(--surface-dark-foreground)/0.7)] max-w-md">
                Discover and join the ultimate university club & event experience with expert tips, social connections, and professional networks.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-display font-bold text-lg text-[hsl(var(--surface-dark-foreground))]">12k+ Members</p>
                <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.6)]">Across 50+ clubs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Floating Button */}
        <div className="absolute top-8 right-8 hidden md:block">
          <button className="bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-background transition-colors">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
