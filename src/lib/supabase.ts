import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type UserRole = Database['public']['Enums']['app_role'];
export type PublicSignupRole = Extract<UserRole, 'provider' | 'client'>;
export type ManagedRole = Extract<UserRole, 'admin' | 'mod'>;
export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export const publicSignupRoles: Array<{ value: PublicSignupRole; label: string; description: string }> = [
  {
    value: 'client',
    label: 'Client',
    description: 'Plan training, nutrition, and household routines.',
  },
  {
    value: 'provider',
    label: 'Provider',
    description: 'Coach or support clients with programming and habits.',
  },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)
  : null;
