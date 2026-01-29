import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { companyInfo } from "@/lib/data";
import { getPublishedSections, getPublishedMeta, getDraftSections, getDraftMeta, updateDraftSection, updateDraftMeta, updateSectionOrder, publishDrafts, clearCache, DashboardSection, DashboardPageMeta, DEFAULT_SECTIONS, DEFAULT_PAGE_META } from "@/lib/dashboardData";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import { EditModeToolbar } from "@/components/EditModeToolbar";
import logoImage from "@/assets/twentysix-logo.png";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Building2,
  Percent,
  Gift,
  Lightbulb,
  ArrowRight,
  Database,
  ChevronRight,
  MapPin,
  Calendar,
  HelpCircle,
  Home,
  LineChart,
  LucideIcon,
  GripVertical,
  Pencil,
  Lock,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  users: Users,
  alertTriangle: AlertTriangle,
  lineChart: LineChart,
  percent: Percent,
  gift: Gift,
  lightbulb: Lightbulb,
  arrowRight: ArrowRight,
  database: Database,
};

const colorMap: Record<string, string> = {
  'market-context': 'bg-emerald-600',
  'market-data': 'bg-blue-600',
  'role-details': 'bg-purple-600',
  'risks': 'bg-amber-500',
  'market-comparison': 'bg-indigo-600',
  'bonus': 'bg-pink-600',
  'benefits': 'bg-teal-600',
  'benefits-trends': 'bg-orange-500',
  'next-steps': 'bg-cyan-600',
  'data-sources': 'bg-slate-600',
};

interface EditableCardProps {
  section: DashboardSection;
  isEditMode: boolean;
  onUpdate: (id: string, field: keyof DashboardSection, value: string) => void;
}

function EditableCard({ section, isEditMode, onUpdate }: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [editDescription, setEditDescription] = useState(section.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = iconMap[section.icon || 'barChart'] || BarChart3;
  const bgColor = colorMap[section.slug] || 'bg-slate-600';

  function handleSaveEdit() {
    onUpdate(section.id, 'title', editTitle);
    onUpdate(section.id, 'description', editDescription);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditTitle(section.title);
    setEditDescription(section.description || '');
    setIsEditing(false);
  }

  if (isEditMode && isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <Card className="p-5 bg-white border-2 border-indigo-500 shadow-lg">
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-semibold"
              placeholder="Section title"
              data-testid={`edit-title-${section.slug}`}
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              placeholder="Section description"
              data-testid={`edit-description-${section.slug}`}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} data-testid={`save-edit-${section.slug}`}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const cardContent = (
    <Card
      className={`p-5 bg-white border shadow-sm transition-all duration-200 ${
        isEditMode
          ? 'border-dashed border-slate-300 hover:border-indigo-400 cursor-move'
          : 'border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer group'
      }`}
      data-testid={`launcher-${section.slug}`}
    >
      <div className="flex items-start gap-4">
        {isEditMode && (
          <div
            className="mt-1 p-1 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <div className={`w-11 h-11 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-slate-800 ${!isEditMode ? 'group-hover:text-primary' : ''} transition-colors`}>
              {section.title}
            </h3>
            {isEditMode ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 hover:bg-slate-100 rounded"
                data-testid={`edit-btn-${section.slug}`}
              >
                <Pencil className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
        </div>
      </div>
    </Card>
  );

  if (isEditMode) {
    return (
      <div ref={setNodeRef} style={style}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={section.route}>
      {cardContent}
    </Link>
  );
}

export function ExecutiveSummary() {
  const { user, isEditMode, setEditMode } = useAuth();
  const [sections, setSections] = useState<DashboardSection[]>([]);
  const [originalSections, setOriginalSections] = useState<DashboardSection[]>([]);
  const [pageMeta, setPageMeta] = useState<DashboardPageMeta>(DEFAULT_PAGE_META);
  const [originalPageMeta, setOriginalPageMeta] = useState<DashboardPageMeta>(DEFAULT_PAGE_META);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [editingSubheadline, setEditingSubheadline] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadData();
  }, [isEditMode]);

  async function loadData() {
    setLoading(true);
    try {
      if (isEditMode && user) {
        const [sectionsData, metaData] = await Promise.all([
          getDraftSections(),
          getDraftMeta()
        ]);
        const filteredSections = sectionsData.filter(s => !s.slug.includes('dashboard-draft') && s.slug !== 'dashboard');
        setSections(filteredSections);
        setOriginalSections(JSON.parse(JSON.stringify(filteredSections)));
        if (metaData) {
          setPageMeta(metaData);
          setOriginalPageMeta(JSON.parse(JSON.stringify(metaData)));
        }
      } else {
        const [sectionsData, metaData] = await Promise.all([
          getPublishedSections(),
          getPublishedMeta()
        ]);
        setSections(sectionsData);
        setOriginalSections(JSON.parse(JSON.stringify(sectionsData)));
        setPageMeta(metaData);
        setOriginalPageMeta(JSON.parse(JSON.stringify(metaData)));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setSections(DEFAULT_SECTIONS.filter(s => s.slug !== 'dashboard'));
      setPageMeta(DEFAULT_PAGE_META);
    } finally {
      setLoading(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  }

  function updateSection(id: string, field: keyof DashboardSection, value: string) {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function hasChanges(): boolean {
    return JSON.stringify(sections) !== JSON.stringify(originalSections) ||
           JSON.stringify(pageMeta) !== JSON.stringify(originalPageMeta);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const orderUpdates = sections.map((s, index) => ({
        id: s.id,
        sort_order: index + 1,
      }));
      await updateSectionOrder(orderUpdates);

      for (const section of sections) {
        const original = originalSections.find(s => s.id === section.id);
        if (original && (original.title !== section.title || original.description !== section.description)) {
          await updateDraftSection(section.id, {
            title: section.title,
            description: section.description,
          });
        }
      }

      if (pageMeta.id && pageMeta.id !== 'default') {
        await updateDraftMeta(pageMeta.id, {
          headline: pageMeta.headline,
          subheadline: pageMeta.subheadline,
          intro: pageMeta.intro,
        });
      } else {
        console.log('Draft meta not available for update, headline/subheadline saved with sections');
      }

      await publishDrafts();
      clearCache();

      setOriginalSections(JSON.parse(JSON.stringify(sections)));
      setOriginalPageMeta(JSON.parse(JSON.stringify(pageMeta)));
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleUndo() {
    setSections(JSON.parse(JSON.stringify(originalSections)));
    setPageMeta(JSON.parse(JSON.stringify(originalPageMeta)));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
            Personalised Pay & Benefits Dashboard
          </p>
          {isEditMode && editingHeadline ? (
            <Input
              value={pageMeta.headline || ''}
              onChange={(e) => setPageMeta({ ...pageMeta, headline: e.target.value })}
              onBlur={() => setEditingHeadline(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingHeadline(false)}
              className="text-4xl lg:text-5xl font-display font-bold mb-3 border-indigo-500"
              autoFocus
              data-testid="input-edit-headline"
            />
          ) : (
            <h1
              className={`text-4xl lg:text-5xl font-display font-bold text-primary mb-3 ${isEditMode ? 'cursor-pointer hover:bg-indigo-50 rounded px-2 -mx-2' : ''}`}
              onClick={() => isEditMode && setEditingHeadline(true)}
              data-testid="dashboard-headline"
            >
              {pageMeta.headline || 'Use Your Dashboard'}
              {isEditMode && <Pencil className="inline w-5 h-5 ml-2 text-slate-400" />}
            </h1>
          )}
          {isEditMode && editingSubheadline ? (
            <Input
              value={pageMeta.subheadline || ''}
              onChange={(e) => setPageMeta({ ...pageMeta, subheadline: e.target.value })}
              onBlur={() => setEditingSubheadline(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingSubheadline(false)}
              className="border-indigo-500"
              autoFocus
              data-testid="input-edit-subheadline"
            />
          ) : (
            <Link href="#pay-ranges">
              <span
                className={`inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors ${isEditMode ? 'cursor-pointer' : 'cursor-pointer'}`}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    setEditingSubheadline(true);
                  }
                }}
                data-testid="dashboard-subheadline"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{pageMeta.subheadline || 'How to interpret pay ranges'}</span>
                {isEditMode && <Pencil className="w-3 h-3 text-slate-400" />}
              </span>
            </Link>
          )}
        </div>
        <img
          src={logoImage}
          alt="TwentySix"
          className="h-14 w-auto hidden lg:block"
          style={{ opacity: 1 }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Organisation</p>
            <p className="font-semibold">{companyInfo.name}</p>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sector & Location</p>
            <p className="font-semibold">{companyInfo.industry}, {companyInfo.location}</p>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Report Date</p>
            <p className="font-semibold">{companyInfo.reportDate}</p>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">What do you want to do today?</h2>
        <p className="text-muted-foreground mb-6">Select a section to explore your personalised pay and benefits data.</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5 bg-white border border-slate-200 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : isEditMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => (
                  <EditableCard
                    key={section.id}
                    section={section}
                    isEditMode={isEditMode}
                    onUpdate={updateSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <EditableCard
                key={section.id}
                section={section}
                isEditMode={false}
                onUpdate={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      <Card id="pay-ranges" className="p-6 bg-slate-50 border border-slate-200">
        <h3 className="font-display font-bold text-xl text-slate-800 mb-4">How to Interpret Pay Ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-amber-600">Lower Quartile</p>
            <p className="text-xs text-muted-foreground">25% of the market pays below this level</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-yellow-600">Lower-Mid</p>
            <p className="text-xs text-muted-foreground">Between lower quartile and median</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-green-600">Median</p>
            <p className="text-xs text-muted-foreground">The middle point - 50% pay more, 50% pay less</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-teal-600">Upper-Mid</p>
            <p className="text-xs text-muted-foreground">Between median and upper quartile</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="font-semibold mb-1 text-blue-600">Upper Quartile</p>
            <p className="text-xs text-muted-foreground">Only 25% of the market pays more</p>
          </div>
        </div>
      </Card>

      {isSupabaseConfigured && !user && (
        <div className="text-center pt-8 pb-4 border-t border-slate-200">
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            data-testid="button-edit-as-admin"
          >
            <Lock className="w-4 h-4" />
            <span>Edit as Admin</span>
          </button>
        </div>
      )}

      {user && !isEditMode && (
        <div className="text-center pt-8 pb-4 border-t border-slate-200">
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            data-testid="button-enter-edit-mode"
          >
            <Pencil className="w-4 h-4" />
            <span>Enter Edit Mode</span>
          </button>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {isEditMode && (
        <EditModeToolbar
          hasChanges={hasChanges()}
          onSave={handleSave}
          onUndo={handleUndo}
          saving={saving}
        />
      )}
    </div>
  );
}
