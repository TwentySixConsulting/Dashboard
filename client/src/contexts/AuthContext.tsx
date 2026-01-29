import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { loadAllContent, saveBulkContent, clearContentCache } from '@/lib/siteContent';
import { Session, User } from '@supabase/supabase-js';

interface PendingChange {
  key: string;
  value: string;
  page?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEditMode: boolean;
  pendingChanges: Map<string, PendingChange>;
  hasUnsavedChanges: boolean;
  setEditMode: (mode: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  trackChange: (key: string, value: string, page?: string) => void;
  saveAllChanges: () => Promise<boolean>;
  undoAllChanges: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsEditMode(true);
        loadAllContent();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsEditMode(true);
        loadAllContent();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      setIsEditMode(true);
      await loadAllContent();
    }
    return { error: error?.message ?? null };
  }

  async function signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsEditMode(false);
    setPendingChanges(new Map());
  }

  function setEditMode(mode: boolean) {
    if (mode && !user) return;
    setIsEditMode(mode);
    if (!mode) {
      setPendingChanges(new Map());
    }
  }

  const trackChange = useCallback((key: string, value: string, page?: string) => {
    setPendingChanges(prev => {
      const next = new Map(prev);
      next.set(key, { key, value, page });
      return next;
    });
  }, []);

  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return true;
    
    const changes = Array.from(pendingChanges.values());
    const success = await saveBulkContent(changes);
    
    if (success) {
      setPendingChanges(new Map());
    }
    
    return success;
  }, [pendingChanges]);

  const undoAllChanges = useCallback(() => {
    setPendingChanges(new Map());
    clearContentCache();
    loadAllContent();
    window.location.reload();
  }, []);

  const hasUnsavedChanges = pendingChanges.size > 0;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isEditMode,
      pendingChanges,
      hasUnsavedChanges,
      setEditMode,
      signIn,
      signInWithMagicLink,
      signOut,
      trackChange,
      saveAllChanges,
      undoAllChanges,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
