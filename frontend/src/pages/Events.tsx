import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Clock, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Festival", "Technology", "Academic", "Social", "Arts", "Business"];

const EventsSkeleton = () => (
  <div className="space-y-6 mb-16">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex flex-col md:flex-row gap-6 border border-border rounded-2xl p-5">
        <Skeleton className="w-full md:w-64 h-44 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: events = [], isLoading, error } = useEvents(activeCategory, search);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">UPCOMING</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Campus Events<br />&amp; Happenings.
            </h1>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag-pill text-sm transition-colors ${activeCategory === cat ? "bg-foreground text-background border-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        {isLoading && <EventsSkeleton />}

        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Failed to load events. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-6 mb-16">
            {events.map(event => {
              const eventDate = new Date(event.event_date);
              const dateStr = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

              return (
                <Link to={`/events/${event.id}`} key={event.id} className="group block">
                  <div className="flex flex-col md:flex-row gap-6 border border-border rounded-2xl p-5 hover:border-primary transition-colors">
                    <div className="relative w-full md:w-64 h-44 rounded-xl overflow-hidden shrink-0 bg-secondary">
                      {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-muted-foreground/20">
                          {event.title[0]}
                        </div>
                      )}
                      {event.club_name && (
                        <span className="absolute top-3 left-3 tag-pill bg-background/90 backdrop-blur-sm text-xs border-none">{event.club_name}</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{dateStr}</p>
                        <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeStr}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
