import {
  Building2,
  Megaphone,
  TrendingUp,
  Shield,
  FileText,
  Star,
  BarChart3,
  MessageCircle,
  Users,
  Train,
  LayoutGrid,
  LucideIcon,
} from 'lucide-react';

// Slug → icon (normalize slug to lowercase when matching)
const SLUG_TO_ICON: Record<string, LucideIcon> = {
  'local-governance': Building2,
  'voice-of-people': Megaphone,
  'progress-path': TrendingUp,
  'crime-alert': Shield,
  'ground-report': FileText,
  'civic-cast-special': Star,
  'accountability-meter': BarChart3,
  'todays-question': MessageCircle,
  'from-citizens': Users,
  'india-on-rails': Train,
};

// Icon by seed order (id 1–10) so we get correct icon even if slug is missing or different
const ICON_BY_ORDER: LucideIcon[] = [
  Building2,   // 1 स्थानीय सुशासन
  Megaphone,   // 2 जनता की आवाज
  TrendingUp,  // 3 प्रगति पथ
  Shield,      // 4 आपराधिक सतर्कता
  FileText,    // 5 ग्राउंड रिपोर्ट
  Star,        // 6 Civic कॉस्ट स्पेशल
  BarChart3,   // 7 जवाबदेही मीटर
  MessageCircle, // 8 आज का सवाल
  Users,       // 9 सीधे नागरिक से
  Train,       // 10 पटरी पर भारत
];

export function getCategoryIcon(slug?: string | null, id?: number): LucideIcon {
  const normalizedSlug = typeof slug === 'string' ? slug.trim().toLowerCase() : '';
  if (normalizedSlug && SLUG_TO_ICON[normalizedSlug]) {
    return SLUG_TO_ICON[normalizedSlug];
  }
  if (id != null && id >= 1 && id <= ICON_BY_ORDER.length) {
    return ICON_BY_ORDER[id - 1];
  }
  return LayoutGrid;
}
