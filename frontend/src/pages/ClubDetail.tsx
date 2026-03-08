import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Users, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useClub, useJoinClub, useLeaveClub } from "@/hooks/useClubs";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ClubDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { data: club, isLoading, error } = useClub(slug);
  const { data: dashboard } = useDashboard();
  const { user } = useAuth();
<<<<<<< HEAD
  const navigate = useNavigate();
=======
  const { toast } = useToast();
>>>>>>> e1ffc206dd9fe94cf2929b49e41fb913c960ce71
  const joinClub = useJoinClub();
  const leaveClub = useLeaveClub();

  const isMember = dashboard?.memberships?.some(m => m.club_id === club?.id) ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto">
          <Skeleton className="h-4 w-32 mb-8" />
          <Skeleton className="h-72 md:h-96 w-full rounded-2xl mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 section-padding max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Club Not Found</h1>
          <Link to="/clubs" className="btn-primary text-sm">Back to Clubs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleJoinToggle = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (isMember) {
      leaveClub.mutate(club.id, {
        onSuccess: () => toast({ title: `Left ${club.name}` }),
        onError: (err) => toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' }),
      });
    } else {
      joinClub.mutate(club.id, {
        onSuccess: () => toast({ title: `Joined ${club.name}! 🎉` }),
        onError: (err) => toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' }),
      });
    }
  };

  const isActionPending = joinClub.isPending || leaveClub.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/clubs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Clubs
        </Link>

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-10 bg-secondary">
          {club.logo_url ? (
            <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl font-display font-bold text-muted-foreground/10">
              {club.name[0]}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface-dark))] via-[hsl(var(--surface-dark)/0.3)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="tag-pill bg-primary text-primary-foreground text-xs border-none mb-4 inline-block">{club.category}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-[hsl(var(--surface-dark-foreground))]">{club.name}</h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Club</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{club.description}</p>

            <h3 className="font-display text-xl font-bold text-foreground mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {["Weekly Meetings & Workshops", "Networking Opportunities", "Competition Participation", "Leadership Development", "Social Events & Retreats", "Mentorship Programs"].map(item => (
                <div key={item} className="flex items-center gap-3 bg-secondary rounded-xl p-4">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="bg-secondary rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-2xl text-foreground">{club.member_count}</span>
                <span className="text-sm text-muted-foreground">members</span>
              </div>
              <button
                onClick={handleJoinToggle}
                disabled={isActionPending}
                className="btn-primary w-full justify-center text-sm mb-3"
              >
                {isActionPending ? "Please wait…" : isMember ? "Leave Club" : "Join This Club"} <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="btn-outline-dark w-full justify-center text-sm">
                Contact Club
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-secondary rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium text-foreground">{club.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground">{club.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubDetail;
