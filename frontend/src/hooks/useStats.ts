import { useQuery } from '@tanstack/react-query';

const API = import.meta.env.VITE_API_URL ?? '';

export interface PlatformStats {
  total_members: string;   // postgres returns numeric as string
  active_clubs: string;
  total_clubs: string;
  upcoming_events: string;
  total_memberships: string;
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json() as { data: PlatformStats };
      return json.data;
    },
    staleTime: 60_000, // cache for 1 min
  });
}

/** Format a raw count number into a short label e.g. 12400 → "12k+" */
export function fmtCount(raw: string | number | undefined, suffix = '+'): string {
  const n = Number(raw ?? 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M${suffix}`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}k${suffix}`;
  return `${n}${suffix}`;
}
