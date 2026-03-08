// Types shared between frontend and backend

export interface User {
  id: string;
  student_id: string;
  name: string;
  email: string;
  role: 'student' | 'club_admin' | 'staff';
  avatar_url: string | null;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo_url: string | null;
  member_count: number;
  is_active: boolean;
}

/** Extended club shape returned by staff endpoints */
export interface StaffClub extends Club {
  admin_id: string;
  admin_name: string;
  admin_email: string;
  president_id: string | null;
  president_name: string | null;
  president_email: string | null;
  created_at: string;
}

export interface ClubMember {
  id: string;         // membership id
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  user_id: string;
  name: string;
  email: string;
  student_id: string;
  avatar_url: string | null;
}

export interface Event {
  id: string;
  title: string;
  club_id: string;
  club_name?: string;
  description: string;
  event_date: string; // ISO 8601
  location: string;
  total_seats: number;
  registered_count: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  banner_url: string | null;
}

export interface Membership {
  id: string;
  user_id: string;
  club_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
}

export interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  created_at: string;
}

export interface AuthTokenPayload {
  sub: string;  // user UUID
  role: User['role'];
  iat: number;
  exp: number;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
  issues?: unknown[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
}
