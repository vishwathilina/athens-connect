import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Clock, MapPin, Calendar, Users, ArrowLeft, Share2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useEvent, useRsvp, useCancelRsvp } from "@/hooks/useEvents";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id!);
  const { data: dashboard } = useDashboard();
  const { accessToken } = useAuth();
  const rsvp = useRsvp();
  const cancelRsvp = useCancelRsvp();

  const hasRsvp = dashboard?.rsvps?.some(r => r.event_id === event?.id) ?? false;
  const isMutating = rsvp.isPending || cancelRsvp.isPending;

  const eventDate = event ? new Date(event.event_date) : null;
  const dateStr = eventDate ? eventDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
  const timeStr = eventDate ? eventDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto">
          <Skeleton className="h-96 w-full rounded-2xl mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Link to="/events" className="btn-primary text-sm">Back to Events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-[28rem] mb-10">
          {event.banner_url ? (
            <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="font-display text-8xl font-bold text-muted-foreground/30">
                {event.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.3)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="tag-pill bg-primary text-primary-foreground text-xs border-none mb-4 inline-block">{event.status}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[hsl(var(--surface-dark-foreground))] mb-2">{event.title}</h1>
            <p className="text-sm text-[hsl(var(--surface-dark-foreground)/0.7)]">{dateStr}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Event</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{event.description}</p>

            <h3 className="font-display text-xl font-bold text-foreground mb-4">What To Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Engaging Activities", "Networking Opportunities", "Free Refreshments", "Exclusive Giveaways", "Expert Speakers", "Community Building"].map(item => (
                <div key={item} className="flex items-center gap-3 bg-secondary rounded-xl p-4">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <div className="bg-secondary rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-2xl text-foreground">{event.registered_count.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {event.total_seats > 0 ? `of ${event.total_seats.toLocaleString()} seats filled` : "people attending"}
              </p>
              {event.total_seats > 0 && (
                <div className="w-full bg-muted rounded-full h-1.5 mb-5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (event.registered_count / event.total_seats) * 100)}%` }}
                  />
                </div>
              )}
              {accessToken ? (
                hasRsvp ? (
                  <button
                    className="btn-outline-dark w-full justify-center text-sm mb-3"
                    onClick={() => cancelRsvp.mutate(event.id)}
                    disabled={isMutating}
                  >
                    {cancelRsvp.isPending ? "Cancelling…" : "Cancel RSVP"}
                  </button>
                ) : (
                  <button
                    className="btn-primary w-full justify-center text-sm mb-3"
                    onClick={() => rsvp.mutate(event.id)}
                    disabled={isMutating || event.status === "completed" || event.status === "cancelled"}
                  >
                    {rsvp.isPending ? "Registering…" : <>RSVP Now <ArrowUpRight className="w-4 h-4" /></>}
                  </button>
                )
              ) : (
                <Link to="/signin" className="btn-primary w-full justify-center text-sm mb-3 inline-flex">
                  Sign in to RSVP <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
              <button className="btn-outline-dark w-full justify-center text-sm">
                <Share2 className="w-4 h-4" /> Share Event
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-secondary rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">{dateStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium text-foreground">{timeStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{event.location}</p>
                </div>
              </div>
              {event.club_name && (
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Organized by</p>
                    <p className="text-sm font-medium text-foreground">{event.club_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
