import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AppUser } from '../lib/types';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const currentSubscribedUserIdRef = useRef<string | null>(null);
  const profileChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Helper to remove any active Supabase realtime profile channel
  const cleanupChannel = async () => {
    if (profileChannelRef.current) {
      await supabase.removeChannel(profileChannelRef.current);
      profileChannelRef.current = null;
    }
  };

  useEffect(() => {
    let active = true;

    // Fetch profile and subscribe to realtime updates
    const setupProfileSubscription = async (userId: string) => {
      // Prevent duplicate fetches/subscriptions for the same user
      if (currentSubscribedUserIdRef.current === userId) {
        return;
      }
      currentSubscribedUserIdRef.current = userId;

      try {
        setError(null);

        // 1. Fetch current profile with explicit columns matching AppUser
        const { data, error: fetchError } = await supabase
          .from('users')
          .select(
            'id, email, full_name, company_name, logo_url, plan, plan_expires_at, stripe_customer_id, stripe_subscription_id, subscription_status, trial_ends_at, country, currency, province, timezone, created_at, updated_at'
          )
          .eq('id', userId)
          .single();

        if (!active) return;
        if (currentSubscribedUserIdRef.current !== userId) return;

        if (fetchError) {
          console.error('[AuthContext] Error fetching profile:', fetchError);
          setError(new Error(fetchError.message));
          setProfile(null);
        } else {
          setProfile(data as AppUser);
        }

        // 2. Set up realtime row-level updates for the users table
        await cleanupChannel();
        if (!active) return;
        if (currentSubscribedUserIdRef.current !== userId) return;

        const channel = supabase
          .channel(`profile-updates-${userId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'users',
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              if (active && currentSubscribedUserIdRef.current === userId && payload.new && Object.keys(payload.new).length > 0) {
                setProfile(payload.new as AppUser);
              }
            }
          );

        profileChannelRef.current = channel;
        channel.subscribe();
      } catch (err) {
        console.error('[AuthContext] Unexpected error during profile setup:', err);
        if (active && currentSubscribedUserIdRef.current === userId) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    const handleAuthStateChange = async (sessionUser: User | null) => {
      if (sessionUser) {
        setUser(sessionUser);
        await setupProfileSubscription(sessionUser.id);
      } else {
        setUser(null);
        setProfile(null);
        setError(null);
        currentSubscribedUserIdRef.current = null;
        await cleanupChannel();
      }
      if (active) {
        setLoading(false);
      }
    };

    // Listen for auth state changes (which handles initial session load natively via the INITIAL_SESSION event)
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!active) return;
        await handleAuthStateChange(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      authListener.unsubscribe();
      cleanupChannel();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
    } catch (err) {
      console.error('[AuthContext] Error during sign out:', err);
      throw err;
    }
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    profile,
    loading,
    error,
    signOut,
  }), [user, profile, loading, error, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
