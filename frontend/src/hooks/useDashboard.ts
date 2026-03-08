import { useQuery } from '@tanstack/react-query';
import type { User, Membership, RSVP, Event } from '../../../shared/types';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL ?? '';

interface DashboardMembership extends Membership {
  club_name: string;
  slug: string;
  category: string;
  logo_url: string | null;
  member_count: number;
}

interface DashboardRsvp extends RSVP {
  event_title: string;
  event_date: string;
  location: string;
  event_status: Event['status'];
}

export interface DashboardData {
  user: User;
  memberships: DashboardMembership[];
  rsvps: DashboardRsvp[];
}

export function useDashboard() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/dashboard/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      const json = await res.json() as { data: DashboardData };
      return json.data;
    },
    enabled: !!accessToken,
  });
}
