import { ArrowUpRight } from "lucide-react";
import event1 from "@/assets/event1.jpg";

const StatsSection = () => {
  return (
    <section className="section-padding max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Discover The Joy Of Campus Life At Every Level, From Community Gatherings To World-Class Events.
          </p>
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
          Enjoy Campus Life From<br className="hidden md:block" /> Clubs To Events.
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tags Card */}
        <div className="bg-secondary rounded-2xl p-6 flex flex-col justify-between min-h-[280px]">
          <div className="flex flex-wrap gap-2 mb-6">
            {["#ClubEvents", "#CampusVibes", "#ClubLife", "#StudentCommunity", "#ClubChampionship"].map(tag => (
              <span key={tag} className="tag-pill text-xs">{tag}</span>
            ))}
          </div>
          <div className="flex -space-x-2 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background" />
            ))}
          </div>
          <p className="font-display font-bold text-foreground text-lg">
            Experience Campus At Its Best With The Right Community Always With You.
          </p>
        </div>

        {/* Easy to Reach Card */}
        <div className="relative rounded-2xl overflow-hidden min-h-[280px]">
          <img src={event1} alt="Campus event" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] to-transparent" />
          <div className="absolute top-4 right-4">
            <button className="bg-background/80 rounded-full p-2">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[hsl(var(--surface-dark-foreground)/0.7)] text-sm mb-1">Easy To</p>
            <p className="font-display font-bold text-xl text-[hsl(var(--surface-dark-foreground))] mb-3">Reach.</p>
            <p className="text-[hsl(var(--surface-dark-foreground)/0.6)] text-xs mb-1">Active Clubs</p>
            <p className="font-display font-bold text-3xl text-[hsl(var(--surface-dark-foreground))]">199.00+</p>
          </div>
        </div>

        {/* User Growth Card */}
        <div className="bg-primary rounded-2xl p-6 flex flex-col justify-between min-h-[280px]">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-primary-foreground">User<br />Growth</h3>
            <button className="bg-primary-foreground/20 rounded-full p-2">
              <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div>
            <p className="text-sm text-primary-foreground/70 mb-1">Relative To The Previous Year</p>
            <p className="font-display font-bold text-5xl md:text-6xl text-primary-foreground">80.99%</p>
          </div>
          <p className="text-sm text-primary-foreground/80 font-medium">Improve Your Campus Life Today.</p>
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground font-medium">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          24/7 STUDENT SUPPORT
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          BEST EXPERIENCE
        </span>
      </div>
    </section>
  );
};

export default StatsSection;
