import { useState, useEffect } from "react";
import { supabase, DashboardSection, DashboardPageMeta, isSupabaseConfigured } from "@/lib/supabase";
import { getDraftSections, getDraftMeta, updateDraftSection, updateDraftMeta, updateSectionOrder, publishDrafts, clearCache } from "@/lib/dashboardData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Save, 
  Upload, 
  LogOut, 
  AlertCircle,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Session, User } from "@supabase/supabase-js";

function SortableItem({ section, isSelected, onSelect }: { section: DashboardSection; isSelected: boolean; onSelect: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      onClick={onSelect}
      data-testid={`section-item-${section.slug}`}
    >
      <button
        className="touch-none p-1 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        data-testid={`drag-handle-${section.slug}`}
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-slate-800 truncate">{section.title}</p>
        <p className="text-xs text-slate-500 truncate">{section.route}</p>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      onLogin(data.user);
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-slate-600 mb-4">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <Button variant="outline" onClick={() => setMagicLinkSent(false)}>
              Try different email
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-slate-600 text-center mb-6">Sign in to edit dashboard content</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              data-testid="input-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading} data-testid="button-login">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleMagicLink}
          disabled={loading}
          data-testid="button-magic-link"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Send Magic Link
        </Button>
      </Card>
    </div>
  );
}

function ConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel-publish">
            Cancel
          </Button>
          <Button onClick={onConfirm} data-testid="button-confirm-publish">
            Yes, Publish
          </Button>
        </div>
      </Card>
    </div>
  );
}

function AdminEditor({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [sections, setSections] = useState<DashboardSection[]>([]);
  const [pageMeta, setPageMeta] = useState<DashboardPageMeta | null>(null);
  const [selectedSection, setSelectedSection] = useState<DashboardSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [sectionsData, metaData] = await Promise.all([
      getDraftSections(),
      getDraftMeta()
    ]);
    setSections(sectionsData);
    setPageMeta(metaData);
    if (sectionsData.length > 0 && !selectedSection) {
      setSelectedSection(sectionsData[0]);
    }
    setLoading(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      
      const orderUpdates = newSections.map((s, index) => ({
        id: s.id,
        sort_order: index + 1,
      }));
      
      await updateSectionOrder(orderUpdates);
    }
  }

  async function handleSaveDraft() {
    setSaving(true);
    setSaveStatus('idle');
    
    try {
      if (selectedSection) {
        await updateDraftSection(selectedSection.id, {
          title: selectedSection.title,
          description: selectedSection.description,
          route: selectedSection.route,
          icon: selectedSection.icon,
        });
      }
      
      if (pageMeta) {
        await updateDraftMeta(pageMeta.id, {
          headline: pageMeta.headline,
          subheadline: pageMeta.subheadline,
          intro: pageMeta.intro,
        });
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
    }
    
    setSaving(false);
  }

  async function handlePublish() {
    setPublishing(true);
    const success = await publishDrafts();
    if (success) {
      clearCache();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
    }
    setPublishing(false);
    setShowPublishConfirm(false);
  }

  function updateSelectedSection(field: keyof DashboardSection, value: string) {
    if (!selectedSection) return;
    const updated = { ...selectedSection, [field]: value };
    setSelectedSection(updated);
    setSections(sections.map(s => s.id === updated.id ? updated : s));
  }

  function updatePageMeta(field: keyof DashboardPageMeta, value: string) {
    if (!pageMeta) return;
    setPageMeta({ ...pageMeta, [field]: value });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">You are editing DRAFT content. Changes won't be visible until published.</span>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard Editor</h1>
            <p className="text-sm text-slate-500">Logged in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" /> Error saving
              </span>
            )}
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={saving}
              data-testid="button-save-draft"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button 
              onClick={() => setShowPublishConfirm(true)} 
              disabled={publishing}
              data-testid="button-publish"
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              Publish
            </Button>
            <Button variant="ghost" onClick={onLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Page Header</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={pageMeta?.headline || ''}
                onChange={(e) => updatePageMeta('headline', e.target.value)}
                placeholder="Use Your Dashboard"
                data-testid="input-headline"
              />
            </div>
            <div>
              <Label htmlFor="subheadline">Subheadline</Label>
              <Input
                id="subheadline"
                value={pageMeta?.subheadline || ''}
                onChange={(e) => updatePageMeta('subheadline', e.target.value)}
                placeholder="How to interpret pay ranges"
                data-testid="input-subheadline"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="intro">Introduction Text</Label>
              <Textarea
                id="intro"
                value={pageMeta?.intro || ''}
                onChange={(e) => updatePageMeta('intro', e.target.value)}
                placeholder="Welcome to your dashboard..."
                rows={3}
                data-testid="input-intro"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Sections</h2>
            <p className="text-sm text-slate-500 mb-4">Drag to reorder sections</p>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {sections.map((section) => (
                    <SortableItem
                      key={section.id}
                      section={section}
                      isSelected={selectedSection?.id === section.id}
                      onSelect={() => setSelectedSection(section)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Edit Section {selectedSection ? `- ${selectedSection.title}` : ''}
            </h2>
            
            {selectedSection ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section-title">Title</Label>
                  <Input
                    id="section-title"
                    value={selectedSection.title}
                    onChange={(e) => updateSelectedSection('title', e.target.value)}
                    data-testid="input-section-title"
                  />
                </div>
                <div>
                  <Label htmlFor="section-description">Description</Label>
                  <Textarea
                    id="section-description"
                    value={selectedSection.description || ''}
                    onChange={(e) => updateSelectedSection('description', e.target.value)}
                    rows={3}
                    data-testid="input-section-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="section-route">Route</Label>
                    <Input
                      id="section-route"
                      value={selectedSection.route}
                      onChange={(e) => updateSelectedSection('route', e.target.value)}
                      data-testid="input-section-route"
                    />
                  </div>
                  <div>
                    <Label htmlFor="section-icon">Icon</Label>
                    <Input
                      id="section-icon"
                      value={selectedSection.icon || ''}
                      onChange={(e) => updateSelectedSection('icon', e.target.value)}
                      placeholder="e.g., barChart, users"
                      data-testid="input-section-icon"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Select a section to edit</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={showPublishConfirm}
        onConfirm={handlePublish}
        onCancel={() => setShowPublishConfirm(false)}
        title="Publish Changes?"
        message="This will make all draft changes visible to everyone. Are you sure you want to publish?"
      />
    </div>
  );
}

export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 max-w-md w-full mx-4 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Supabase Not Configured</h2>
          <p className="text-slate-600 mb-4">
            To enable the admin editor, please configure your Supabase credentials in the environment variables.
          </p>
          <p className="text-sm text-slate-500">
            Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm onLogin={() => {}} />;
  }

  return <AdminEditor user={session.user} onLogout={handleLogout} />;
}
