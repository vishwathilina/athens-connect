import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Edit, MapPin, Plus, RefreshCw, ShieldAlert, Users } from "lucide-react";
import { useState } from "react";
import { EventModal } from "@/components/EventModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Club {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    logo_url: string;
    member_count: number;
}

interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    total_seats: number;
    registered_count: number;
    status: string;
    banner_url: string;
}

const PresidentDashboard = () => {
    const { user, accessToken, isLoading: authLoading } = useAuth();
    const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const queryClient = useQueryClient();

    // Fetch managed clubs
    const { data: clubsWrapper, isLoading: clubsLoading } = useQuery({
        queryKey: ["president", "clubs"],
        queryFn: async () => {
            const res = await fetch("/api/president/clubs", {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to load managed clubs");
            return res.json();
        },
        enabled: !!user && user.role === "club_admin" && !!accessToken,
    });

    const clubs: Club[] = clubsWrapper?.data || [];

    // Re-sync selected club if loaded
    if (!selectedClubId && clubs.length > 0) {
        setSelectedClubId(clubs[0].id);
    }

    // Fetch events for selected club
    const { data: eventsWrapper, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
        queryKey: ["president", "clubs", selectedClubId, "events"],
        queryFn: async () => {
            const res = await fetch(`/api/president/clubs/${selectedClubId}/events`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to load events");
            return res.json();
        },
        enabled: !!selectedClubId && !!accessToken,
    });

    const events: Event[] = eventsWrapper?.data || [];
    const selectedClub = clubs.find(c => c.id === selectedClubId);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/president/clubs/${selectedClubId}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create event");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Event created successfully");
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["president", "clubs", selectedClubId, "events"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to create event");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ eventId, data }: { eventId: string, data: any }) => {
            const res = await fetch(`/api/president/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update event");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Event updated successfully");
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["president", "clubs", selectedClubId, "events"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update event");
        }
    });

    if (!authLoading && (!user || user.role !== "club_admin")) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-28 section-padding max-w-7xl mx-auto pb-24">
                <div className="mb-10">
                    <span className="tag-pill bg-primary text-primary-foreground text-xs mb-4 inline-block">PRESIDENT</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                        Club Management.
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your clubs, add new events, and oversee activities.</p>
                </div>

                {authLoading || clubsLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full max-w-md" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : clubs.length === 0 ? (
                    <div className="bg-secondary rounded-2xl p-8 text-center border border-border">
                        <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-display font-bold text-foreground mb-2">No Clubs Assigned</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            You are marked as a club president, but you aren't currently assigned as the admin of any active clubs in the system.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar / Club Selector */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="font-display text-lg font-bold text-foreground">My Clubs</h3>
                            <div className="flex flex-col gap-2">
                                {clubs.map(club => (
                                    <button
                                        key={club.id}
                                        onClick={() => setSelectedClubId(club.id)}
                                        className={`text-left px-4 py-3 rounded-xl transition-colors border ${selectedClubId === club.id
                                            ? 'bg-primary/10 border-primary shadow-sm'
                                            : 'bg-secondary/50 border-transparent hover:bg-secondary'
                                            }`}
                                    >
                                        <p className={`font-medium ${selectedClubId === club.id ? 'text-primary' : 'text-foreground'}`}>
                                            {club.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {club.member_count} members
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Panel */}
                        <div className="lg:col-span-3">
                            {selectedClub && (
                                <div className="bg-secondary/30 border border-border rounded-2xl p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-3xl font-display font-bold text-primary">
                                                {selectedClub.logo_url ? <img src={selectedClub.logo_url} alt="Logo" className="w-full h-full object-cover rounded-2xl" /> : selectedClub.name[0]}
                                            </div>
                                            <div>
                                                <h2 className="font-display text-2xl font-bold text-foreground">{selectedClub.name}</h2>
                                                <span className="text-xs text-primary font-medium mt-1 inline-block capitalize px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                                    {selectedClub.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Events Section */}
                                    <div className="mt-8 pt-8 border-t border-border">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-display text-xl font-bold text-foreground">Club Events</h3>
                                            <button
                                                onClick={() => { setModalMode('create'); setEditingEvent(null); setIsModalOpen(true); }}
                                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Create Event
                                            </button>
                                        </div>
                                        {eventsLoading ? (
                                            <div className="space-y-4">
                                                {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
                                            </div>
                                        ) : events.length === 0 ? (
                                            <div className="text-center py-10 bg-background rounded-xl border border-dashed border-border">
                                                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                                <p className="text-muted-foreground text-sm">No events created yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {events.map((evt) => (
                                                    <div key={evt.id} className="bg-background border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/30 hover:shadow-sm">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="font-semibold text-foreground truncate">{evt.title}</h4>
                                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${evt.status === 'upcoming' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' :
                                                                    evt.status === 'ongoing' ? 'text-green-500 border-green-500/30 bg-green-500/10' :
                                                                        'text-muted-foreground border-border'
                                                                    } capitalize`}>
                                                                    {evt.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                                                    {new Date(evt.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(evt.event_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                    <MapPin className="w-3.5 h-3.5 text-primary/70" /> {evt.location}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                    <Users className="w-3.5 h-3.5 text-primary/70" /> {evt.registered_count} / {evt.total_seats} RSVPs
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => { setModalMode('edit'); setEditingEvent(evt); setIsModalOpen(true); }}
                                                            className="shrink-0 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" /> Edit
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <EventModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                mode={modalMode}
                initialData={editingEvent as any}
                isLoading={createMutation.isPending || updateMutation.isPending}
                onSubmit={(data) => {
                    if (modalMode === 'create') {
                        createMutation.mutate(data);
                    } else if (editingEvent) {
                        updateMutation.mutate({ eventId: editingEvent.id, data });
                    }
                }}
            />
        </div>
    );
};

export default PresidentDashboard;
