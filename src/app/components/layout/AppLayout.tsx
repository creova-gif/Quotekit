import React, { useState, useEffect, Suspense } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { getPlan } from '../../../lib/plans';
import { AuthLoadingScreen } from '../auth/AuthGuard';
import { 
  LayoutGrid, 
  Zap, 
  Sparkles, 
  Edit, 
  Users, 
  Eye, 
  Calendar, 
  Activity, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search, 
  FileText 
} from 'lucide-react';

// Maps icon name strings to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: string }>> = {
  grid: LayoutGrid,
  zap: Zap,
  sparkles: Sparkles,
  edit: Edit,
  users: Users,
  eye: Eye,
  calendar: Calendar,
  activity: Activity,
  message: MessageSquare,
  book: BookOpen,
  chart: BarChart3,
  file: FileText,
  settings: Settings,
};

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string;
  badgeColor?: 'gray' | 'blue' | 'red' | 'green' | 'purple';
}

const sidebarItems: NavItem[] = [
  { id: 'overview', label: 'Overview', path: '/dashboard', icon: 'grid', badge: '24' },
  { id: 'quickpropose', label: 'Quick-propose', path: '/dashboard/quickpropose', icon: 'zap', badge: 'AI', badgeColor: 'purple' },
  { id: 'nexusai', label: 'Nexus AI', path: '/dashboard/nexusai', icon: 'sparkles', badge: 'Claude', badgeColor: 'purple' },
  { id: 'builder', label: 'Builder', path: '/dashboard/builder', icon: 'edit' },
  { id: 'clients', label: 'Clients', path: '/dashboard/clients', icon: 'users', badge: '6' },
  { id: 'portal', label: 'Client portal', path: '/dashboard/portal', icon: 'eye' },
  { id: 'scheduler', label: 'Scheduler', path: '/dashboard/scheduler', icon: 'calendar' },
  { id: 'automations', label: 'Automations', path: '/dashboard/automations', icon: 'activity', badge: '5 on', badgeColor: 'green' },
  { id: 'leadforms', label: 'Lead forms', path: '/dashboard/leadforms', icon: 'message', badge: 'New', badgeColor: 'green' },
  { id: 'library', label: 'Content library', path: '/dashboard/library', icon: 'book' },
  { id: 'projects', label: 'Projects', path: '/dashboard/projects', icon: 'activity', badge: '5', badgeColor: 'blue' },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics', icon: 'chart' },
  { id: 'inbox', label: 'Inbox', path: '/dashboard/inbox', icon: 'message', badge: '3', badgeColor: 'red' },
];

const bottomNavItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutGrid },
  { label: 'Quick-propose', path: '/dashboard/quickpropose', icon: Zap },
  { label: 'Builder', path: '/dashboard/builder', icon: Edit },
  { label: 'Clients', path: '/dashboard/clients', icon: Users },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

// Helper to calculate trial days left
const getDaysLeft = (endsAt: string | null | undefined): number => {
  if (!endsAt) return 0;
  const trialEnd = new Date(endsAt).getTime();
  const now = new Date().getTime();
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Helper to extract initials
const getInitials = (fullName: string | null | undefined, email: string | null | undefined): string => {
  const name = fullName || (email ? email.split('@')[0] : '');
  if (!name) return 'U';
  
  const words = name.trim().split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return 'U';
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

function LogoIcon() {
  return (
    <div className="w-[27px] h-[27px] bg-qk-blue rounded-[7px] flex items-center justify-center">
      <svg width="13" height="13" fill="#fff" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z" />
      </svg>
    </div>
  );
}

function LogoText() {
  return (
    <span className="text-[16.5px] tracking-[-0.2px] font-semibold text-qk-ink" style={{ fontFamily: 'var(--qk-serif)' }}>
      Quote<em className="italic text-qk-blue">Kit</em>
    </span>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  badge,
  badgeColor = 'gray',
  small = false,
  onClick,
}: {
  icon: string;
  label: string;
  to: string;
  badge?: string;
  badgeColor?: 'gray' | 'blue' | 'red' | 'green' | 'purple';
  small?: boolean;
  onClick?: () => void;
}) {
  const badgeColors = {
    gray: 'bg-qk-s1 text-qk-ink3',
    blue: 'bg-qk-blue-l text-qk-blue',
    red: 'bg-qk-red-l text-qk-red',
    green: 'bg-qk-grn-l text-qk-grn',
    purple: 'bg-qk-pur-l text-qk-pur',
  };

  const IconComponent = iconMap[icon] || FileText;

  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-[9px] py-[7px] mx-[5px] my-[1px] rounded-[10px] cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-qk-blue outline-none ${
          isActive
            ? 'bg-qk-blue-l text-qk-blue font-medium'
            : 'text-qk-ink2 hover:bg-qk-s1 hover:text-qk-ink font-normal'
        } ${small ? 'text-[12.5px]' : 'text-[13px]'}`
      }
    >
      {({ isActive }) => (
        <>
          <IconComponent
            className={`w-[14px] h-[14px] flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`}
            aria-hidden="true"
          />
          <span className="flex-1 truncate">{label}</span>
          {badge && (
            <span
              className={`text-[10px] px-[5px] py-[1px] rounded-[7px] font-medium ml-auto flex-shrink-0 ${badgeColors[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const { user, profile } = useAuth();
  const { t, i18n } = useTranslation();

  const fullName = profile?.full_name || (user?.email ? user.email.split('@')[0] : 'User');
  const email = profile?.email || user?.email || '';
  const initials = getInitials(profile?.full_name, user?.email);

  const planId = profile?.plan ?? 'starter';
  const planName = getPlan(planId).name;

  let planText = t('plan_standard', { planName });
  let upgradeText = t('upgrade_plan');

  if (profile?.subscription_status === 'trialing') {
    const daysLeft = getDaysLeft(profile?.trial_ends_at);
    planText = t('plan_trial', { planName, daysLeft });
  } else if (profile?.subscription_status) {
    const status = profile.subscription_status;
    planText = t('plan_status', { planName, status: status.charAt(0).toUpperCase() + status.slice(1) });
  }

  if (planId === 'starter') {
    upgradeText = t('upgrade_to_pro');
  } else if (planId === 'pro') {
    upgradeText = t('upgrade_to_business');
  } else {
    upgradeText = t('manage_billing');
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-qk-s0">
      {/* Sidebar Items */}
      <div className="pt-1.5 flex-1 overflow-y-auto">
        <div className="px-[13px] pt-[13px] pb-1 text-[10px] font-semibold tracking-[1px] uppercase text-qk-ink3">
          {t('workspace')}
        </div>

        {sidebarItems.map((item) => {
          let transKey = item.id;
          if (item.id === 'quickpropose') transKey = 'quick_propose';
          if (item.id === 'nexusai') transKey = 'nexus_ai';
          if (item.id === 'portal') transKey = 'client_portal';
          return (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={t(transKey, item.label)}
              to={item.path}
              badge={item.badge}
              badgeColor={item.badgeColor}
              onClick={onItemClick}
            />
          );
        })}

        <div className="h-[1px] bg-qk-bdr mx-[13px] my-[5px]"></div>

        <div className="px-[13px] pt-[13px] pb-1 text-[10px] font-semibold tracking-[1px] uppercase text-qk-ink3">
          {t('recent')}
        </div>
        <SidebarItem
          icon="file"
          label={t('volta_goods')}
          small
          to="/dashboard/builder"
          onClick={onItemClick}
        />
        <SidebarItem
          icon="file"
          label={t('opal_events')}
          small
          to="/dashboard/builder"
          onClick={onItemClick}
        />
      </div>

      {/* Sidebar Footer */}
      <div className="p-[9px] pt-[9px] border-t border-qk-bdr flex-shrink-0">
        <Link
          to="/dashboard/settings?tab=billing"
          onClick={onItemClick}
          className="block bg-qk-amb-l border border-qk-amb-m rounded-md px-[10px] py-2 mb-[5px] hover:bg-amber-100/30 transition-colors focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
          aria-label={`${planText}. Click to upgrade or manage billing.`}
        >
          <div className="text-[11px] mb-[1px]" style={{ color: '#92400e' }}>
            {planText}
          </div>
          <div className="text-[12px] text-qk-amb font-semibold">{upgradeText}</div>
        </Link>

        {/* Language Selection Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-[5px] text-[11px] text-qk-ink2 border border-qk-bdr rounded-md bg-qk-s1">
          <span className="font-medium">Langue:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => i18n.changeLanguage('en-CA')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-qk-blue ${
                i18n.language.startsWith('en')
                  ? 'bg-qk-blue text-white'
                  : 'bg-transparent text-qk-ink3 hover:text-qk-ink'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage('fr-CA')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-qk-blue ${
                i18n.language.startsWith('fr')
                  ? 'bg-qk-blue text-white'
                  : 'bg-transparent text-qk-ink3 hover:text-qk-ink'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        <Link
          to="/dashboard/settings"
          onClick={onItemClick}
          className="flex items-center gap-2 px-2 py-[7px] rounded-md transition-colors hover:bg-qk-s1 focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
          aria-label="View user profile settings"
        >
          <div className="w-[31px] h-[31px] rounded-full bg-qk-blue-l flex items-center justify-center text-[11.5px] font-semibold text-qk-blue flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium truncate text-qk-ink">{fullName}</div>
            <div className="text-[11px] text-qk-ink3 truncate">{email}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function BottomTabItem({
  label,
  to,
  icon: IconComponent,
}: {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: string }>;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 h-full py-2 transition-all focus-visible:ring-2 focus-visible:ring-qk-blue outline-none ${
          isActive ? 'text-qk-blue' : 'text-qk-ink2 hover:text-qk-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <IconComponent className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className={`text-[10px] tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Close drawer on navigation
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const initials = getInitials(profile?.full_name, user?.email);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-qk-bg font-[--qk-sans]" style={{ fontFamily: 'var(--qk-sans)' }}>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-qk-blue focus:px-4 focus:py-2.5 focus:border focus:border-qk-blue focus:rounded-md focus:z-[999] outline-none focus:ring-2 focus:ring-qk-blue"
      >
        {t('skip_to_main')}
      </a>

      {/* Topbar Header */}
      <header className="h-[52px] bg-qk-s0 border-b border-qk-bdr flex items-center justify-between px-4 z-[200] flex-shrink-0">
        <div className="flex items-center h-full">
          {/* Hamburger button (Mobile/Tablet only) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-md hover:bg-qk-s1 text-qk-ink2 transition-colors mr-2 focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
            aria-label={t('open_sidebar')}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-sidebar-drawer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Logo - Desktop (aligns with sidebar width and border) */}
          <Link
            to="/dashboard"
            className="hidden lg:flex w-[220px] h-full items-center gap-[9px] px-4 border-r border-qk-bdr -ml-4 mr-4 hover:bg-qk-s1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-qk-blue"
          >
            <LogoIcon />
            <LogoText />
          </Link>

          {/* Logo - Mobile/Tablet */}
          <Link
            to="/dashboard"
            className="lg:hidden flex items-center gap-[9px] hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-qk-blue rounded"
          >
            <LogoIcon />
            <LogoText />
          </Link>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-[7px]">
          {/* Search bar */}
          <div className="flex items-center gap-[6px] bg-qk-s1 border border-qk-bdr rounded-[10px] px-[10px] py-[5px] w-full max-w-[125px] xs:max-w-[160px] sm:max-w-[190px] transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-qk-ink3 flex-shrink-0" aria-hidden="true" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              aria-label={t('search_placeholder')}
              className="border-none bg-transparent outline-none text-[13px] text-qk-ink w-full placeholder:text-qk-ink3 focus:ring-0"
              style={{ fontFamily: 'var(--qk-sans)' }}
            />
          </div>

          {/* Notifications */}
          <button
            className="relative w-[29px] h-[29px] rounded-md bg-transparent border border-qk-bdr flex items-center justify-center cursor-pointer transition-all hover:bg-qk-s1 focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
            aria-label={t('view_notifications')}
          >
            <Bell className="w-3.5 h-3.5 text-qk-ink2" aria-hidden="true" />
            <div className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-qk-red border-[1.5px] border-qk-s0" aria-hidden="true"></div>
          </button>

          {/* Quick Propose (Hidden on mobile) */}
          <Link
            to="/dashboard/quickpropose"
            className="hidden sm:flex px-3 py-[6px] rounded-[10px] text-[13px] items-center gap-[5px] border border-qk-blue bg-qk-blue text-white hover:bg-qk-blue-d transition-all focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:ring-offset-2 outline-none"
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            {t('quick_propose')}
          </Link>

          {/* User profile avatar link */}
          <Link
            to="/dashboard/settings"
            className="w-[29px] h-[29px] rounded-full bg-qk-blue-l border-2 border-qk-blue-m flex items-center justify-center text-[11px] font-semibold text-qk-blue hover:opacity-90 transition-all focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
            aria-label="User settings"
          >
            {initials}
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (visible >= 1024px) */}
        <aside
          role="navigation"
          aria-label="Sidebar"
          className="hidden lg:flex w-[220px] bg-qk-s0 border-r border-qk-bdr flex-col overflow-hidden flex-shrink-0"
        >
          <SidebarContent />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
          <div
            id="main-content"
            className="flex-1 overflow-auto focus:outline-none"
            tabIndex={-1}
          >
            <Suspense fallback={<AuthLoadingScreen />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile/Tablet Bottom Navigation Bar (visible < 1024px) */}
      <nav
        role="navigation"
        aria-label="Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-qk-s0 border-t border-qk-bdr flex items-center justify-around z-[100] pb-safe"
      >
        {bottomNavItems.map((item) => {
          let transKey = 'overview';
          if (item.path.endsWith('quickpropose')) transKey = 'quick_propose';
          else if (item.path.endsWith('builder')) transKey = 'builder';
          else if (item.path.endsWith('clients')) transKey = 'clients';
          else if (item.path.endsWith('settings')) transKey = 'settings';

          return (
            <BottomTabItem
              key={item.path}
              label={t(transKey, item.label)}
              to={item.path}
              icon={item.icon}
            />
          );
        })}
      </nav>

      {/* Mobile/Tablet Slide-in Overlay Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[300] transition-opacity duration-200"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile/Tablet Slide-in Overlay Drawer Panel */}
      <div
        id="mobile-sidebar-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Drawer"
        className={`lg:hidden fixed top-0 bottom-0 left-0 w-[240px] bg-qk-s0 border-r border-qk-bdr z-[310] transition-all duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-[52px] border-b border-qk-bdr flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-[9px]">
            <LogoIcon />
            <LogoText />
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-qk-s1 text-qk-ink2 transition-colors focus-visible:ring-2 focus-visible:ring-qk-blue outline-none"
            aria-label="Close sidebar menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-hidden">
          <SidebarContent onItemClick={() => setIsDrawerOpen(false)} />
        </div>
      </div>
    </div>
  );
}
