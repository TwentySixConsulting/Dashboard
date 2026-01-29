import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { loadAllContent, saveBulkContent, clearContentCache } from '@/lib/siteContent';
import { publishDrafts, clearCache as clearDashboardCache, updateDraftMeta } from '@/lib/dashboardData';
import { Session, User } from '@supabase/supabase-js';

interface PendingChange {
  key: string;
  value: string;
  page?: string;
  type?: 'content' | 'section' | 'meta' | 'order';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isEditMode: boolean;
  contentLoaded: boolean;
  pendingChanges: Map<string, PendingChange>;
  hasUnsavedChanges: boolean;
  setEditMode: (mode: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  trackChange: (key: string, value: string, page?: string, type?: 'content' | 'section' | 'meta' | 'order') => void;
  saveAllChanges: () => Promise<boolean>;
  undoAllChanges: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load content when entering edit mode
  useEffect(() => {
    async function loadContent() {
      if (isEditMode && user) {
        setContentLoaded(false);
        await loadAllContent();
        setContentLoaded(true);
      }
    }
    loadContent();
  }, [isEditMode, user]);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      setIsEditMode(true);
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
    setContentLoaded(false);
    setPendingChanges(new Map());
  }

  function setEditMode(mode: boolean) {
    if (mode && !user) return;
    setIsEditMode(mode);
    if (!mode) {
      setPendingChanges(new Map());
      setContentLoaded(false);
    }
  }

  const trackChange = useCallback((key: string, value: string, page?: string, type: 'content' | 'section' | 'meta' | 'order' = 'content') => {
    setPendingChanges(prev => {
      const next = new Map(prev);
      next.set(key, { key, value, page, type });
      return next;
    });
  }, []);

  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return true;
    
    const changes = Array.from(pendingChanges.values());
    
    // Separate content changes from dashboard changes
    const contentChanges = changes.filter(c => c.type === 'content');
    const metaChanges = changes.filter(c => c.type === 'meta');
    const hasSectionOrOrderChanges = changes.some(c => c.type === 'section' || c.type === 'order');
    
    let success = true;
    
    // Save site_content changes
    if (contentChanges.length > 0) {
      const contentSuccess = await saveBulkContent(contentChanges);
      if (!contentSuccess) success = false;
    }
    
    // Save meta changes as drafts first
    if (metaChanges.length > 0) {
      const metaUpdates: Record<string, string> = {};
      for (const change of metaChanges) {
        if (change.key === 'dashboard_headline') {
          metaUpdates.headline = change.value;
        } else if (change.key === 'dashboard_subheadline') {
          metaUpdates.subheadline = change.value;
        }
      }
      if (Object.keys(metaUpdates).length > 0) {
        await updateDraftMeta(metaUpdates);
      }
    }
    
    // Publish all dashboard changes (sections, meta, order)
    if (hasSectionOrOrderChanges || metaChanges.length > 0) {
      const dashboardSuccess = await publishDrafts();
      if (!dashboardSuccess) success = false;
    }
    
    if (success) {
      setPendingChanges(new Map());
      clearDashboardCache();
    }
    
    return success;
  }, [pendingChanges]);

  const undoAllChanges = useCallback(() => {
    setPendingChanges(new Map());
    clearContentCache();
    clearDashboardCache();
    setContentLoaded(false);
    window.location.reload();
  }, []);

  const hasUnsavedChanges = pendingChanges.size > 0;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isEditMode,
      contentLoaded,
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
