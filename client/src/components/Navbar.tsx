// ============================================================
// CallistheniX – Navbar
// Dark athletic top navigation bar with language toggle
// ============================================================
import { useUser, type AppView } from '@/contexts/UserContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserMenu } from '@/components/UserMenu';
import { Dumbbell, LayoutDashboard, Utensils, User, BookOpen, Globe, TrendingUp, Settings } from 'lucide-react';

const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { view: 'programs', label: 'Programs', icon: <BookOpen size={16} /> },
  { view: 'progress', label: 'Progress', icon: <TrendingUp size={16} /> },
  { view: 'diet', label: 'Nutrition', icon: <Utensils size={16} /> },
  { view: 'profile', label: 'Profile', icon: <User size={16} /> },
  { view: 'settings', label: 'Settings', icon: <Settings size={16} /> },
];

export default function Navbar() {
  const { currentView, setCurrentView, profile } = useUser();
  const { language, setLanguage } = useI18n();

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: 'oklch(0.10 0.005 285)',
        borderBottom: '1px solid oklch(1 0 0 / 8%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 group"
      >
        <div
          className="w-8 h-8 flex items-center justify-center"
          style={{ background: 'oklch(0.68 0.18 142)', borderRadius: '2px' }}
        >
          <Dumbbell size={16} style={{ color: 'oklch(0.10 0.005 285)' }} />
        </div>
        <span
          className="font-display text-xl font-black tracking-wider uppercase"
          style={{ color: 'oklch(0.96 0.008 80)', fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          Callistheni<span style={{ color: 'oklch(0.68 0.18 142)' }}>X</span>
        </span>
      </button>

      {/* Nav Items */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-150"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: currentView === item.view ? 'oklch(0.68 0.18 142)' : 'oklch(0.65 0.01 285)',
              background: currentView === item.view ? 'oklch(0.68 0.18 142 / 10%)' : 'transparent',
              borderBottom: currentView === item.view ? '2px solid oklch(0.68 0.18 142)' : '2px solid transparent',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center gap-1">
        <button
          onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
          className="p-2 rounded transition-all"
          style={{
            color: 'oklch(0.68 0.18 142)',
            background: 'oklch(0.68 0.18 142 / 10%)',
          }}
          title={language === 'el' ? 'Switch to English' : 'Μετάβαση στα Ελληνικά'}
        >
          <Globe size={16} />
        </button>
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className="p-2 rounded transition-all duration-150"
            style={{
              color: currentView === item.view ? 'oklch(0.68 0.18 142)' : 'oklch(0.50 0.01 285)',
              background: currentView === item.view ? 'oklch(0.68 0.18 142 / 10%)' : 'transparent',
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Language toggle + User Menu */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all"
          style={{
            background: 'oklch(0.68 0.18 142 / 10%)',
            border: '1px solid oklch(0.68 0.18 142 / 30%)',
            color: 'oklch(0.68 0.18 142)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
          title={language === 'el' ? 'Switch to English' : 'Μετάβαση στα Ελληνικά'}
        >
          <Globe size={14} />
          {language === 'el' ? 'ΕΛ' : 'EN'}
        </button>
        <UserMenu />
      </div>
    </nav>
  );
}
