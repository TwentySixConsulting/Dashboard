import { supabase, DashboardSection, DashboardPageMeta } from './supabase';

const DEFAULT_SECTIONS: DashboardSection[] = [
  { id: '1', slug: 'dashboard', title: 'Dashboard', description: 'Your dashboard starting point', icon: 'home', route: '/', status: 'published', sort_order: 1, updated_at: '', updated_by: null },
  { id: '2', slug: 'market-context', title: 'Market Context', description: 'Economic trends and market analysis', icon: 'trendingUp', route: '/market-context', status: 'published', sort_order: 2, updated_at: '', updated_by: null },
  { id: '3', slug: 'market-data', title: 'Market Data Results', description: 'Detailed pay data and comparisons', icon: 'barChart', route: '/market-data', status: 'published', sort_order: 3, updated_at: '', updated_by: null },
  { id: '4', slug: 'role-details', title: 'Role-by-Role Detail', description: 'Individual role analysis', icon: 'users', route: '/role-details', status: 'published', sort_order: 4, updated_at: '', updated_by: null },
  { id: '5', slug: 'risks', title: 'Strengths & Risks', description: 'Position distribution and outlier analysis', icon: 'alertTriangle', route: '/risks', status: 'published', sort_order: 5, updated_at: '', updated_by: null },
  { id: '6', slug: 'market-comparison', title: 'Market Comparison', description: 'Visual comparison charts', icon: 'lineChart', route: '/market-comparison', status: 'published', sort_order: 6, updated_at: '', updated_by: null },
  { id: '7', slug: 'bonus', title: 'Bonus Potential', description: 'Bonus and incentive analysis', icon: 'percent', route: '/bonus', status: 'published', sort_order: 7, updated_at: '', updated_by: null },
  { id: '8', slug: 'benefits', title: 'Benefits Breakdown', description: 'Market provision of key benefits', icon: 'gift', route: '/benefits', status: 'published', sort_order: 8, updated_at: '', updated_by: null },
  { id: '9', slug: 'benefits-trends', title: 'Benefits Trends & Ideas', description: 'Emerging themes and ideas', icon: 'lightbulb', route: '/benefits-trends', status: 'published', sort_order: 9, updated_at: '', updated_by: null },
  { id: '10', slug: 'next-steps', title: 'Next Steps', description: 'Recommendations and actions', icon: 'arrowRight', route: '/next-steps', status: 'published', sort_order: 10, updated_at: '', updated_by: null },
  { id: '11', slug: 'data-sources', title: 'Data Sources', description: 'Methodology and sources', icon: 'database', route: '/data-sources', status: 'published', sort_order: 11, updated_at: '', updated_by: null },
];

const DEFAULT_PAGE_META: DashboardPageMeta = {
  id: 'default',
  page_key: 'home',
  status: 'published',
  headline: 'Use Your Dashboard',
  subheadline: 'How to interpret pay ranges',
  intro: 'Welcome to your salary benchmarking dashboard. Use the sections below to explore market data, identify strengths and risks, and plan your reward strategy.',
  updated_at: '',
  updated_by: null,
};

let cachedSections: DashboardSection[] | null = null;
let cachedMeta: DashboardPageMeta | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

function isCacheValid(): boolean {
  return Date.now() - cacheTimestamp < CACHE_DURATION;
}

export async function getPublishedSections(): Promise<DashboardSection[]> {
  if (cachedSections && isCacheValid()) {
    return cachedSections;
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.warn('Supabase not configured, using default sections');
      return DEFAULT_SECTIONS.filter(s => s.slug !== 'dashboard');
    }

    const { data, error } = await supabase
      .from('dashboard_sections')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching sections:', error);
      return DEFAULT_SECTIONS.filter(s => s.slug !== 'dashboard');
    }

    cachedSections = (data || []).filter((s: DashboardSection) => s.slug !== 'dashboard');
    cacheTimestamp = Date.now();
    return cachedSections;
  } catch (err) {
    console.error('Failed to fetch sections:', err);
    return DEFAULT_SECTIONS.filter(s => s.slug !== 'dashboard');
  }
}

export async function getPublishedMeta(): Promise<DashboardPageMeta> {
  if (cachedMeta && isCacheValid()) {
    return cachedMeta;
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.warn('Supabase not configured, using default meta');
      return DEFAULT_PAGE_META;
    }

    const { data, error } = await supabase
      .from('dashboard_page_meta')
      .select('*')
      .eq('status', 'published')
      .eq('page_key', 'home')
      .single();

    if (error) {
      console.error('Error fetching page meta:', error);
      return DEFAULT_PAGE_META;
    }

    cachedMeta = data || DEFAULT_PAGE_META;
    cacheTimestamp = Date.now();
    return cachedMeta;
  } catch (err) {
    console.error('Failed to fetch page meta:', err);
    return DEFAULT_PAGE_META;
  }
}

export async function getDraftSections(): Promise<DashboardSection[]> {
  try {
    const { data, error } = await supabase
      .from('dashboard_sections')
      .select('*')
      .eq('status', 'draft')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching draft sections:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch draft sections:', err);
    return [];
  }
}

export async function getDraftMeta(): Promise<DashboardPageMeta | null> {
  try {
    const { data, error } = await supabase
      .from('dashboard_page_meta')
      .select('*')
      .eq('status', 'draft')
      .eq('page_key', 'home-draft')
      .single();

    if (error) {
      console.error('Error fetching draft meta:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch draft meta:', err);
    return null;
  }
}

export async function updateDraftSection(id: string, updates: Partial<DashboardSection>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dashboard_sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'draft');

    if (error) {
      console.error('Error updating draft section:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to update draft section:', err);
    return false;
  }
}

export async function updateDraftMeta(id: string, updates: Partial<DashboardPageMeta>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dashboard_page_meta')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'draft');

    if (error) {
      console.error('Error updating draft meta:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to update draft meta:', err);
    return false;
  }
}

export async function updateSectionOrder(sections: { id: string; sort_order: number }[]): Promise<boolean> {
  try {
    for (const section of sections) {
      const { error } = await supabase
        .from('dashboard_sections')
        .update({ sort_order: section.sort_order, updated_at: new Date().toISOString() })
        .eq('id', section.id)
        .eq('status', 'draft');

      if (error) {
        console.error('Error updating section order:', error);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to update section order:', err);
    return false;
  }
}

export async function publishDrafts(): Promise<boolean> {
  try {
    const draftSections = await getDraftSections();
    const draftMeta = await getDraftMeta();

    for (const draft of draftSections) {
      const publishedSlug = draft.slug.replace('-draft', '');
      
      const { error } = await supabase
        .from('dashboard_sections')
        .update({
          title: draft.title,
          description: draft.description,
          icon: draft.icon,
          route: draft.route,
          sort_order: draft.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', publishedSlug)
        .eq('status', 'published');

      if (error) {
        console.error('Error publishing section:', error);
        return false;
      }
    }

    if (draftMeta) {
      const { error } = await supabase
        .from('dashboard_page_meta')
        .update({
          headline: draftMeta.headline,
          subheadline: draftMeta.subheadline,
          intro: draftMeta.intro,
          updated_at: new Date().toISOString(),
        })
        .eq('page_key', 'home')
        .eq('status', 'published');

      if (error) {
        console.error('Error publishing meta:', error);
        return false;
      }
    }

    cachedSections = null;
    cachedMeta = null;
    cacheTimestamp = 0;

    return true;
  } catch (err) {
    console.error('Failed to publish drafts:', err);
    return false;
  }
}

export function clearCache(): void {
  cachedSections = null;
  cachedMeta = null;
  cacheTimestamp = 0;
}

export { DEFAULT_SECTIONS, DEFAULT_PAGE_META };
