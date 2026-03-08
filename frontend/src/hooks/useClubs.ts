import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Club, Membership } from '../../../shared/types';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL ?? '';

export function useClubs(category?: string, search?: string) {
  return useQuery({
    queryKey: ['clubs', { category, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const qs = params.toString() ? `?${params}` : '';
      const res = await fetch(`${API}/api/clubs${qs}`);
      if (!res.ok) throw new Error('Failed to fetch clubs');
      const json = await res.json() as { data: Club[] };
      return json.data;
    },
  });
}

export function useClub(slug: string | undefined) {
  return useQuery({
    queryKey: ['clubs', slug],
    queryFn: async () => {
      const res = await fetch(`${API}/api/clubs/${slug}`);
      if (!res.ok) throw new Error('Club not found');
      const json = await res.json() as { data: Club };
      return json.data;
    },
    enabled: !!slug,
  });
}

export function useJoinClub() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (clubId: string) => {
      if (!accessToken) throw new Error('You must be signed in to join a club');
      const res = await fetch(`${API}/api/clubs/${clubId}/join`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await res.json() as { data?: Membership; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to join club');
      return json.data!;
    },
    onSuccess: (_data, clubId) => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      qc.invalidateQueries({ queryKey: ['clubs', clubId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useLeaveClub() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (clubId: string) => {
      if (!accessToken) throw new Error('You must be signed in to leave a club');
      const res = await fetch(`${API}/api/clubs/${clubId}/join`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await res.json() as { data?: unknown; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to leave club');
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
