import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, Navigate } from "react-router-dom";
import { Calendar, Users, MapPin, ArrowUpRight } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
    <Skeleton className="h-6 w-32" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading, error } = useDashboard();

  if (!authLoading && !user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto pb-24">
        {/* Header */}
        <div className="mb-10">
          <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">DASHBOARD</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Welcome back{data?.user?.name ? `, ${data.user.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your campus life.</p>
        </div>

        {isLoading || authLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <p className="text-muted-foreground">Failed to load dashboard. Please try again.</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-secondary rounded-2xl p-6">
                <p className="text-xs text-muted-foreground mb-1">Clubs Joined</p>
                <p className="font-display text-3xl font-bold text-foreground">{data?.memberships?.length ?? 0}</p>
              </div>
              <div className="bg-secondary rounded-2xl p-6">
                <p className="text-xs text-muted-foreground mb-1">Upcoming RSVPs</p>
                <p className="font-display text-3xl font-bold text-foreground">
                  {data?.rsvps?.filter(r => r.event_status === 'upcoming' || r.event_status === 'ongoing').length ?? 0}
                </p>
              </div>
              <div className="bg-secondary rounded-2xl p-6">
                <p className="text-xs text-muted-foreground mb-1">Account Role</p>
                <p className="font-display text-3xl font-bold text-foreground capitalize">{data?.user?.role ?? '—'}</p>
              </div>
            </div>

            {/* My Clubs */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-bold text-foreground">My Clubs</h2>
                <Link to="/clubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Browse all <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {!data?.memberships?.length ? (
                <div className="bg-secondary rounded-2xl p-8 text-center">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">You haven't joined any clubs yet.</p>
                  <Link to="/clubs" className="btn-primary text-sm mt-4 inline-flex">Explore Clubs</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.memberships.map(m => (
                    <Link
                      key={m.id}
                      to={`/clubs/${m.slug}`}
                      className="bg-secondary rounded-2xl p-5 hover:bg-secondary/70 transition-colors flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xl font-display font-bold text-primary">
                        {m.club_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{m.club_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.category} · {m.member_count} members</p>
                        <span className="text-xs text-primary mt-1 inline-block capitalize">{m.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* My RSVPs */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-bold text-foreground">My RSVPs</h2>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Browse events <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {!data?.rsvps?.length ? (
                <div className="bg-secondary rounded-2xl p-8 text-center">
                  <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No upcoming events. Find something to attend!</p>
                  <Link to="/events" className="btn-primary text-sm mt-4 inline-flex">Browse Events</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.rsvps.map(r => (
                    <Link
                      key={r.id}
                      to={`/events/${r.event_id}`}
                      className="bg-secondary rounded-2xl p-5 hover:bg-secondary/70 transition-colors flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{r.event_title}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {r.location}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border shrink-0 ${
                        r.status === 'confirmed' ? 'text-green-500 border-green-500/30 bg-green-500/10' :
                        r.status === 'waitlisted' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
                        'text-muted-foreground border-border'
                      } capitalize`}>
                        {r.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
