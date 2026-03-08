import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  useStaffClubs,
  useStaffClubMembers,
  useEditClub,
  useAssignPresident,
  useSearchUsers,
  useCreateClub,
  type EditClubPayload,
  type CreateClubPayload,
} from "@/hooks/useStaff";
import type { StaffClub, ClubMember, User } from "../../../shared/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Pencil, Users, Crown, ToggleLeft, ToggleRight,
  ChevronRight, X, Check, Search, ShieldAlert, Plus,
  IdCard, UserCheck,
} from "lucide-react";
import { Navigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Shared field component
// ─────────────────────────────────────────────────────────────
function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

// ─────────────────────────────────────────────────────────────
// User Picker — search by name / email / student ID
// ─────────────────────────────────────────────────────────────
function UserPicker({
  label,
  selectedUser,
  onSelect,
}: {
  label: string;
  selectedUser: User | null;
  onSelect: (u: User) => void;
}) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: results, isFetching } = useSearchUsers(query);

  const isStudentIdQuery = /^\d{4,}$/.test(query.trim());

  return (
    <Field label={label}>
      {selectedUser ? (
        <div className="flex items-center justify-between bg-secondary border border-primary/40 rounded-xl px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {selectedUser.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedUser.student_id} · {selectedUser.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setQuery(""); setShowDropdown(false); onSelect(null as unknown as User); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            {isStudentIdQuery
              ? <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            }
            <input
              className={`${inputCls} pl-9`}
              placeholder="Search by name, email, or student ID…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>
          {showDropdown && query.trim().length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {isFetching ? (
                <p className="text-xs text-muted-foreground text-center py-4">Searching…</p>
              ) : (results ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No users found</p>
              ) : (
                (results ?? []).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { onSelect(u); setShowDropdown(false); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                  >
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {u.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        ID: {u.student_id} · {u.email}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────
// Edit Club Modal
// ─────────────────────────────────────────────────────────────
function EditClubModal({ club, onClose }: { club: StaffClub; onClose: () => void }) {
  const { toast } = useToast();
  const editClub = useEditClub();
  const [form, setForm] = useState<EditClubPayload>({
    name: club.name,
    description: club.description,
    category: club.category,
    logo_url: club.logo_url ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editClub.mutate(
      { clubId: club.id, payload: form },
      {
        onSuccess: () => { toast({ title: "Club updated ✓" }); onClose(); },
        onError: (err) => toast({ title: "Error", description: (err as Error).message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Edit Club</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Club Name">
            <input className={inputCls} value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Category">
            <input className={inputCls} value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </Field>
          <Field label="Description">
            <textarea rows={4} className={`${inputCls} resize-none`} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </Field>
          <Field label="Logo URL (optional)">
            <input className={inputCls} value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value || null })} placeholder="https://..." />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline-dark text-sm px-5">Cancel</button>
            <button type="submit" disabled={editClub.isPending} className="btn-primary text-sm px-5">
              {editClub.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Assign President Modal  (search from current members OR by student ID)
// ─────────────────────────────────────────────────────────────
function AssignPresidentModal({ club, onClose }: { club: StaffClub; onClose: () => void }) {
  const { toast } = useToast();
  const { data: members, isLoading } = useStaffClubMembers(club.id);
  const assignPresident = useAssignPresident();

  // Tab: 'members' (pick from club roster) | 'lookup' (search any user by ID)
  const [tab, setTab] = useState<'members' | 'lookup'>('members');
  const [memberSearch, setMemberSearch] = useState("");
  const [lookupUser, setLookupUser] = useState<User | null>(null);

  const filteredMembers = (members ?? []).filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.student_id.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleAssignMember = (member: ClubMember) => {
    assignPresident.mutate(
      { clubId: club.id, userId: member.user_id },
      {
        onSuccess: () => { toast({ title: `${member.name} is now president of ${club.name} ✓` }); onClose(); },
        onError: (err) => toast({ title: "Error", description: (err as Error).message, variant: "destructive" }),
      }
    );
  };

  const handleAssignLookup = () => {
    if (!lookupUser) return;
    assignPresident.mutate(
      { clubId: club.id, userId: lookupUser.id },
      {
        onSuccess: () => { toast({ title: `${lookupUser.name} is now president of ${club.name} ✓` }); onClose(); },
        onError: (err) => toast({ title: "Error", description: (err as Error).message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Assign President</h2>
            <p className="text-xs text-muted-foreground">{club.name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('members')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === 'members' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Users className="w-3.5 h-3.5" /> Club Members
          </button>
          <button
            onClick={() => setTab('lookup')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === 'lookup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <IdCard className="w-3.5 h-3.5" /> Lookup by Student ID
          </button>
        </div>

        {/* Tab: Members */}
        {tab === 'members' && (
          <>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className={`${inputCls} pl-9`}
                  placeholder="Search name, email, or student ID…"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
              ) : filteredMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No members found</p>
              ) : (
                filteredMembers.map((m) => {
                  const isCurrent = m.user_id === club.president_id;
                  return (
                    <div key={m.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {m.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                            {m.name}{isCurrent && <Crown className="w-3 h-3 text-yellow-500 shrink-0" />}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">ID: {m.student_id}</p>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-xs text-yellow-600 font-medium shrink-0">Current</span>
                      ) : (
                        <button
                          onClick={() => handleAssignMember(m)}
                          disabled={assignPresident.isPending}
                          className="shrink-0 flex items-center gap-1 text-xs btn-primary px-3 py-1"
                        >
                          <Check className="w-3 h-3" /> Assign
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Tab: Lookup by student ID */}
        {tab === 'lookup' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-muted-foreground">
              Search any university user by student ID, name, or email.
              The user will be added as a member and assigned as president.
            </p>
            <UserPicker
              label="Find user"
              selectedUser={lookupUser}
              onSelect={(u) => setLookupUser(u ?? null)}
            />
            {lookupUser && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleAssignLookup}
                  disabled={assignPresident.isPending}
                  className="btn-primary text-sm px-5 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  {assignPresident.isPending ? "Assigning…" : "Assign as President"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Create Club Modal
// ─────────────────────────────────────────────────────────────
function CreateClubModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const createClub = useCreateClub();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<CreateClubPayload, 'admin_id'>>({
    name: "",
    description: "",
    category: "",
    logo_url: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) {
      toast({ title: "Please select a president / club admin", variant: "destructive" });
      return;
    }
    createClub.mutate(
      { ...form, logo_url: form.logo_url || null, admin_id: adminUser.id },
      {
        onSuccess: (club) => {
          toast({ title: `Club "${club?.name}" created ✓` });
          onClose();
        },
        onError: (err) => toast({ title: "Error", description: (err as Error).message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">New Club</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Club Name *">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Robotics Club" required />
          </Field>
          <Field label="Category *">
            <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Technology, Arts, Sports…" required />
          </Field>
          <Field label="Description *">
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the club's purpose and activities…"
              required
            />
          </Field>
          <Field label="Logo URL (optional)">
            <input className={inputCls} value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value || null })} placeholder="https://..." />
          </Field>

          {/* President / Admin picker */}
          <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-medium text-foreground">Initial President / Admin *</p>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Search by name, email, or student ID. They will be the club admin.
            </p>
            <UserPicker
              label=""
              selectedUser={adminUser}
              onSelect={(u) => setAdminUser(u ?? null)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline-dark text-sm px-5">Cancel</button>
            <button type="submit" disabled={createClub.isPending || !adminUser} className="btn-primary text-sm px-5 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {createClub.isPending ? "Creating…" : "Create Club"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Club Row
// ─────────────────────────────────────────────────────────────
function ClubRow({
  club,
  onEdit,
  onAssignPresident,
  onToggleActive,
}: {
  club: StaffClub;
  onEdit: (c: StaffClub) => void;
  onAssignPresident: (c: StaffClub) => void;
  onToggleActive: (c: StaffClub) => void;
}) {
  return (
    <div className={`bg-secondary rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${!club.is_active ? "opacity-60" : ""}`}>
      {/* Club Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" />
            : club.name[0]}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-foreground truncate">{club.name}</span>
            <span className="text-xs bg-border text-muted-foreground px-2 py-0.5 rounded-full">{club.category}</span>
            {!club.is_active && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Inactive</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{club.member_count} members</span>
            {club.president_name
              ? <span className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-500" />{club.president_name}</span>
              : <span className="text-yellow-600">No president assigned</span>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onEdit(club)} className="flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 hover:border-primary/50 transition-colors">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button onClick={() => onAssignPresident(club)} className="flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 hover:border-yellow-400/50 transition-colors">
          <Crown className="w-3 h-3 text-yellow-500" /> President
        </button>
        <button
          onClick={() => onToggleActive(club)}
          className={`flex items-center gap-1.5 text-xs border rounded-full px-3 py-1.5 transition-colors ${
            club.is_active
              ? "border-destructive/40 text-destructive hover:bg-destructive/5"
              : "border-green-500/40 text-green-600 hover:bg-green-500/5"
          }`}
        >
          {club.is_active
            ? <><ToggleLeft className="w-3.5 h-3.5" /> Deactivate</>
            : <><ToggleRight className="w-3.5 h-3.5" /> Activate</>}
        </button>
        <a href={`/clubs/${club.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          View <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Staff Dashboard Page
// ─────────────────────────────────────────────────────────────
const StaffDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: clubs, isLoading } = useStaffClubs();
  const editClub = useEditClub();

  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<StaffClub | null>(null);
  const [presidentTarget, setPresidentTarget] = useState<StaffClub | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (user && user.role !== 'staff') return <Navigate to="/" replace />;

  const filtered = (clubs ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (club: StaffClub) => {
    editClub.mutate(
      { clubId: club.id, payload: { is_active: !club.is_active } },
      {
        onSuccess: () => toast({ title: `Club ${club.is_active ? "deactivated" : "activated"} ✓` }),
        onError: (err) => toast({ title: "Error", description: (err as Error).message, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 section-padding max-w-7xl mx-auto pb-16">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Staff Portal</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Club Management</h1>
            <p className="text-muted-foreground mt-1">Manage all university clubs, edit details and assign presidents.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Stats */}
            <div className="bg-secondary rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-foreground">{clubs?.length ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Total Clubs</p>
            </div>
            <div className="bg-secondary rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-foreground">{clubs?.filter((c) => c.is_active).length ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="bg-secondary rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-yellow-500">{clubs?.filter((c) => !c.president_id).length ?? "—"}</p>
              <p className="text-xs text-muted-foreground">No President</p>
            </div>
            {/* New Club button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> New Club
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className={`${inputCls} pl-9`}
            placeholder="Search clubs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Club List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No clubs found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((club) => (
              <ClubRow
                key={club.id}
                club={club}
                onEdit={setEditTarget}
                onAssignPresident={setPresidentTarget}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      {editTarget && <EditClubModal club={editTarget} onClose={() => setEditTarget(null)} />}
      {presidentTarget && <AssignPresidentModal club={presidentTarget} onClose={() => setPresidentTarget(null)} />}
      {showCreateModal && <CreateClubModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};

export default StaffDashboard;

