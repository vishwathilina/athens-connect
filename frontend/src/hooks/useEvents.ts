import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event } from '../../../shared/types';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function useEvents(category?: string, search?: string) {
  return useQuery({
    queryKey: ['events', { category, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const qs = params.toString() ? `?${params}` : '';
      const res = await fetch(`${API}/api/events${qs}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const json = await res.json() as { data: Event[] };
      return json.data;
    },
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await fetch(`${API}/api/events/${id}`);
      if (!res.ok) throw new Error('Event not found');
      const json = await res.json() as { data: Event };
      return json.data;
    },
    enabled: !!id,
  });
}

export function useRsvp() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`${API}/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json() as { data?: { status: string }; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to RSVP');
      return json.data!;
    },
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: ['events', eventId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCancelRsvp() {
  const qc = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`${API}/api/events/${eventId}/rsvp`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json() as { data?: unknown; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to cancel RSVP');
      return json.data;
    },
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: ['events', eventId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
