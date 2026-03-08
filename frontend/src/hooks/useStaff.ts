import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { StaffClub, ClubMember, User } from '../../../shared/types';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL ?? '';

function authHeaders(token: string | null) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Queries ──────────────────────────────────────────────────

export function useStaffClubs() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['staff', 'clubs'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/staff/clubs`, {
        credentials: 'include',
        headers: authHeaders(accessToken),
      });
      if (!res.ok) throw new Error('Failed to fetch clubs');
      const json = await res.json() as { data: StaffClub[] };
      return json.data;
    },
    enabled: !!accessToken,
  });
}

export function useStaffClubMembers(clubId: string | undefined) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['staff', 'clubs', clubId, 'members'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/staff/clubs/${clubId}/members`, {
        credentials: 'include',
        headers: authHeaders(accessToken),
      });
      if (!res.ok) throw new Error('Failed to fetch members');
      const json = await res.json() as { data: ClubMember[] };
      return json.data;
    },
    enabled: !!accessToken && !!clubId,
  });
}

// ── Mutations ────────────────────────────────────────────────

export interface EditClubPayload {
  name?: string;
  description?: string;
  category?: string;
  logo_url?: string | null;
  is_active?: boolean;
}

export function useEditClub() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ clubId, payload }: { clubId: string; payload: EditClubPayload }) => {
      if (!accessToken) throw new Error('Not authenticated');
      const res = await fetch(`${API}/api/staff/clubs/${clubId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders(accessToken),
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { data?: StaffClub; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to update club');
      return json.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', 'clubs'] });
      qc.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
}

export function useAssignPresident() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ clubId, userId }: { clubId: string; userId: string }) => {
      if (!accessToken) throw new Error('Not authenticated');
      const res = await fetch(`${API}/api/staff/clubs/${clubId}/president`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ user_id: userId }),
      });
      const json = await res.json() as { data?: unknown; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to assign president');
      return json.data;
    },
    onSuccess: (_data, { clubId }) => {
      qc.invalidateQueries({ queryKey: ['staff', 'clubs'] });
      qc.invalidateQueries({ queryKey: ['staff', 'clubs', clubId, 'members'] });
    },
  });
}

// ── Search users by name / email / student_id ────────────────
export function useSearchUsers(query: string) {
  const { accessToken } = useAuth();
  // detect if query looks like a student_id (all digits or UIN format)
  const isStudentId = /^\d{4,}$/.test(query.trim());
  const params = new URLSearchParams();
  if (isStudentId) {
    params.set('student_id', query.trim());
  } else if (query.trim()) {
    params.set('search', query.trim());
  }
  return useQuery({
    queryKey: ['staff', 'users', query],
    queryFn: async () => {
      const res = await fetch(`${API}/api/staff/users?${params}`, {
        credentials: 'include',
        headers: authHeaders(accessToken),
      });
      if (!res.ok) throw new Error('Failed to search users');
      const json = await res.json() as { data: User[] };
      return json.data;
    },
    enabled: !!accessToken && query.trim().length >= 2,
    staleTime: 10_000,
  });
}

// ── Create club ───────────────────────────────────────────────
export interface CreateClubPayload {
  name: string;
  description: string;
  category: string;
  logo_url?: string | null;
  admin_id: string;  // the initial president/admin
}

export function useCreateClub() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (payload: CreateClubPayload) => {
      if (!accessToken) throw new Error('Not authenticated');
      const res = await fetch(`${API}/api/staff/clubs`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(accessToken),
        body: JSON.stringify(payload),
      });
      const json = await res.json() as { data?: StaffClub; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to create club');
      return json.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', 'clubs'] });
      qc.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
}
