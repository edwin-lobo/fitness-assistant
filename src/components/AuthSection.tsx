import React, { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, publicSignupRoles, supabase, type PublicSignupRole, type UserProfile } from '../lib/supabase';

type AuthMode = 'signup' | 'login';
type AuthStatus = {
  tone: 'info' | 'success' | 'error';
  message: string;
};

const emptyStatus: AuthStatus = {
  tone: 'info',
  message: 'Public signup creates provider or client accounts only.',
};

const formatAuthError = (message: string) =>
  message.toLowerCase().includes('invalid api key')
    ? 'Supabase rejected the API key. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    : message;

const AuthSection: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<PublicSignupRole>('client');
  const [status, setStatus] = useState<AuthStatus>(emptyStatus);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRole = useMemo(() => publicSignupRoles.find((signupRole) => signupRole.value === role), [role]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setSession(data.session);
      if (data.session?.user.id) {
        await loadProfile(data.session.user.id);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        void loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    void loadSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    if (!supabase) {
      return;
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      setStatus({
        tone: 'error',
        message: `Signed in, but the profile could not be loaded: ${error.message}`,
      });
      return;
    }
    setProfile(data);
  };

  const resetFormStatus = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStatus(emptyStatus);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setStatus({
        tone: 'error',
        message: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using Supabase authentication.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ tone: 'info', message: mode === 'signup' ? 'Creating your account...' : 'Signing you in...' });

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              public_signup_role: role,
            },
          },
        });

        if (error) {
          setStatus({ tone: 'error', message: formatAuthError(error.message) });
        } else if (data.session) {
          setStatus({ tone: 'success', message: 'Account created and signed in.' });
        } else {
          setStatus({ tone: 'success', message: 'Account created. Check your email to confirm your login.' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setStatus({ tone: 'error', message: formatAuthError(error.message) });
        } else {
          setStatus({ tone: 'success', message: 'Signed in successfully.' });
        }
      }
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Authentication failed unexpectedly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setStatus({ tone: 'success', message: 'Signed out.' });
  };

  const statusClassName =
    status.tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : status.tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-primary-100 bg-primary-50 text-primary-700';

  return (
    <section id="auth" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <div className="pill">Supabase login</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Create your Fitness Assistant account</h2>
            <p className="text-lg leading-relaxed text-slate-700">
              Providers and clients can join from the public form. Admin and moderator access stays managed by existing
              admins so operational roles are never self-assigned.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <p className="font-semibold text-slate-900">Provider</p>
              <p className="mt-1">For coaches, trainers, and care teams supporting clients.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <p className="font-semibold text-slate-900">Client</p>
              <p className="mt-1">For people planning workouts, nutrition, and routines.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">Admin and moderator roles are invite-only.</p>
            <p className="mt-1">Promote managed roles in Supabase or an admin console after verifying the user.</p>
          </div>
        </div>

        <div className="card overflow-hidden bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => resetFormStatus('signup')}
                className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'signup' ? 'bg-white text-primary-700 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => resetFormStatus('login')}
                className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Log in
              </button>
            </div>
          </div>

          {session ? (
            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Current session</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{profile?.full_name || session.user.email}</h3>
                <p className="mt-1 text-sm text-slate-600">{session.user.email}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
                  <p className="mt-1 text-lg font-semibold capitalize text-slate-900">{profile?.role || 'Loading'}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Public profile</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {profile?.public_profile ? 'Published' : 'Private'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <form className="space-y-5 p-6" onSubmit={handleSubmit}>
              {mode === 'signup' ? (
                <label className="block text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
                    placeholder="Taylor Fit"
                  />
                </label>
              ) : null}

              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
                  placeholder="At least 6 characters"
                />
              </label>

              {mode === 'signup' ? (
                <label className="block text-sm font-semibold text-slate-700">
                  Account role
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as PublicSignupRole)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
                  >
                    {publicSignupRoles.map((signupRole) => (
                      <option key={signupRole.value} value={signupRole.value}>
                        {signupRole.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {mode === 'signup' && selectedRole ? (
                <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {selectedRole.description}
                </p>
              ) : null}

              <div role="status" className={`rounded-2xl border px-4 py-3 text-sm font-medium ${statusClassName}`}>
                {status.message}
              </div>

              {!isSupabaseConfigured ? (
                <p className="text-xs leading-relaxed text-slate-500">
                  Add these values to your local environment and deployment provider before using real authentication:
                  VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSubmitting ? 'Working...' : mode === 'signup' ? 'Create account' : 'Log in'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
