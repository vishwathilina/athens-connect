import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const EventsSection = () => {
  const { data: events, isLoading, error } = useEvents();

  // Show only up to 2 upcoming events on the homepage
  const upcomingEvents = events?.filter(e => e.status === 'upcoming').slice(0, 2) || [];

  return (
    <section id="events" className="surface-dark rounded-[2rem] mx-4 md:mx-8 my-8">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Campus Events — Don't Miss Out!
          </h2>
          <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] max-w-2xl mx-auto">
            Explore events & unforgettable experiences with our upcoming events. Whether you're a seasoned pro or just starting your campus journey, we've got you covered.
          </p>
        </div>

        {/* Event Cards */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2].map(i => (
                <div key={i} className="border-t border-[hsl(var(--surface-dark-foreground)/0.15)] pt-8 flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-8 w-64 bg-white/10" />
                    <Skeleton className="h-16 w-full max-w-md bg-white/10" />
                    <Skeleton className="h-8 w-48 bg-white/10" />
                    <Skeleton className="h-10 w-28 bg-white/10" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="w-40 h-28 md:w-48 md:h-32 rounded-xl bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-[hsl(var(--surface-dark-foreground)/0.8)]">Failed to load events.</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-10 border-t border-[hsl(var(--surface-dark-foreground)/0.15)] pt-12">
              <Calendar className="w-10 h-10 mx-auto text-[hsl(var(--surface-dark-foreground)/0.4)] mb-4" />
              <p className="text-[hsl(var(--surface-dark-foreground)/0.8)] font-medium">No upcoming events right now.</p>
              <p className="text-[hsl(var(--surface-dark-foreground)/0.5)] text-sm mt-1">Check back later for more campus activities.</p>
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const eventDate = new Date(event.event_date);
              const dateStr = eventDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
              const timeStr = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={event.id} className="border-t border-[hsl(var(--surface-dark-foreground)/0.15)] pt-8">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-xs text-[hsl(var(--surface-dark-foreground)/0.5)] mb-2 capitalize">{event.club_name || event.status}</p>
                      <h3 className="font-display text-2xl font-bold mb-2 text-[hsl(var(--surface-dark-foreground))]">{event.title}</h3>
                      <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.6)] mb-4 max-w-md line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--surface-dark-foreground)/0.5)]">
                          <Clock className="w-3.5 h-3.5" />
                          <div>
                            <span className="block">{dateStr}</span>
                            <span className="block font-medium text-[hsl(var(--surface-dark-foreground))] mt-0.5">{timeStr}</span>
                          </div>
                        </div>
                        <span className="tag-pill bg-primary/20 text-primary text-xs border-none px-3">At</span>
                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--surface-dark-foreground))] font-medium">
                          {event.location}
                        </div>
                      </div>
                      <Link to={`/events/${event.id}`} className="btn-primary text-sm inline-flex">
                        Join Now <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Images */}
                    <div className="flex gap-3">
                      {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="w-40 h-28 md:w-48 md:h-32 rounded-xl object-cover" />
                      ) : (
                        <div className="w-40 h-28 md:w-48 md:h-32 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                          <span className="font-display text-4xl font-bold text-white/20">{event.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All */}
        <div className="text-right mt-8">
          <Link to="/events" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all events <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
