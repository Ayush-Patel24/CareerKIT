import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!isSupabaseConfigured || !supabase) {
      const savedGuest = localStorage.getItem('careerkit_guest_user');
      if (savedGuest) {
        try {
          return JSON.parse(savedGuest);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Supabase is configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up
  const signUp = async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback mode
      const localUser = {
        id: 'local-' + Date.now(),
        email,
        user_metadata: { full_name: fullName || email.split('@')[0] },
      };
      localStorage.setItem('careerkit_guest_user', JSON.stringify(localUser));
      setUser(localUser);
      return { data: { user: localUser }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    return { data, error };
  };

  // Sign in
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      const localUser = {
        id: 'local-' + Date.now(),
        email,
        user_metadata: { full_name: email.split('@')[0] },
      };
      localStorage.setItem('careerkit_guest_user', JSON.stringify(localUser));
      setUser(localUser);
      return { data: { user: localUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase OAuth requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be configured.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });

    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem('careerkit_guest_user');
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out notice:', e);
      }
    }
    setUser(null);
    setSession(null);
    return { error: null };
  };

  // Forgot Password
  const resetPasswordForEmail = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: {},
        error: new Error('Password reset emails require Supabase credentials configured in .env.'),
      };
    }

    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  };

  // Update Password
  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: null };
    }

    return await supabase.auth.updateUser({ password: newPassword });
  };

  // Update Profile
  const updateProfile = async ({ displayName }) => {
    if (!isSupabaseConfigured || !supabase) {
      if (user) {
        const updated = {
          ...user,
          user_metadata: { ...user.user_metadata, full_name: displayName },
        };
        localStorage.setItem('careerkit_guest_user', JSON.stringify(updated));
        setUser(updated);
      }
      return { error: null };
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    if (data?.user) {
      setUser(data.user);
    }
    return { data, error };
  };

  const value = {
    user,
    session,
    loading,
    isSupabaseConfigured,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
