import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Dashboard from './components/pages/Dashboard';
import QuickPropose from './components/pages/QuickPropose';
import Builder from './components/pages/Builder';
import Clients from './components/pages/Clients';
import Portal from './components/pages/Portal';
import Scheduler from './components/pages/Scheduler';
import Automations from './components/pages/Automations';
import LeadForms from './components/pages/LeadForms';
import Library from './components/pages/Library';
import Projects from './components/pages/Projects';
import Analytics from './components/pages/Analytics';
import Inbox from './components/pages/Inbox';
import Settings from './components/pages/Settings';
import NexusAI from './components/pages/NexusAI';
import Landing from './components/pages/Landing';

type PageType = 'dashboard' | 'quickpropose' | 'builder' | 'clients' | 'portal' | 'scheduler' | 'automation' | 'leadforms' | 'library' | 'projects' | 'analytics' | 'inbox' | 'settings' | 'nexusai' | 'landing';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'quickpropose' as const, label: 'Quick-propose' },
    { id: 'builder' as const, label: 'Builder' },
    { id: 'clients' as const, label: 'Clients' },
    { id: 'portal' as const, label: 'Client portal' },
    { id: 'scheduler' as const, label: 'Scheduler' },
    { id: 'automation' as const, label: 'Automations' },
    { id: 'leadforms' as const, label: 'Lead forms' },
    { id: 'library' as const, label: 'Content library' },
    { id: 'projects' as const, label: 'Projects' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'nexusai' as const, label: 'Nexus AI' },
    { id: 'inbox' as const, label: 'Inbox' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <div className="h-screen overflow-hidden bg-qk-bg font-[--qk-sans]" style={{ fontFamily: 'var(--qk-sans)' }}>
      <Toaster position="bottom-right" />

      {/* Topbar */}
      <header className="h-[52px] bg-qk-s0 border-b border-qk-bdr flex items-center z-[200]">
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="w-[220px] h-full flex items-center gap-[9px] px-4 border-r border-qk-bdr flex-shrink-0 cursor-pointer hover:bg-qk-s1 transition-colors"
        >
          <div className="w-[27px] h-[27px] bg-qk-blue rounded-[7px] flex items-center justify-center">
            <svg width="13" height="13" fill="#fff" viewBox="0 0 16 16">
              <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z"/>
            </svg>
          </div>
          <span className="text-[16.5px] tracking-[-0.2px]" style={{ fontFamily: 'var(--qk-serif)' }}>
            Quote<em className="italic text-qk-blue">Kit</em>
          </span>
        </div>

        <nav className="flex items-center gap-[1px] px-3">
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-[10px] py-[5px] rounded-md text-[13px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-qk-blue-l text-qk-blue'
                  : 'text-qk-ink2 hover:bg-qk-s1 hover:text-qk-ink'
              }`}
            >
              {item.label}
              {item.id === 'inbox' && <span className="ml-[3px] text-[10px] px-[5px] py-[1px] rounded-[7px] bg-qk-red-l text-qk-red font-medium">3</span>}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-[7px] pr-[14px]">
          <div className="flex items-center gap-[6px] bg-qk-s1 border border-qk-bdr rounded-[10px] px-[10px] py-[5px] w-[190px]">
            <svg width="12" height="12" className="text-qk-ink3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search…" className="border-none bg-transparent outline-none text-[13px] text-qk-ink w-full placeholder:text-qk-ink3" style={{ fontFamily: 'var(--qk-sans)' }} />
          </div>

          <div className="relative w-[29px] h-[29px] rounded-md bg-transparent border border-qk-bdr flex items-center justify-center cursor-pointer transition-all hover:bg-qk-s1">
            <svg width="14" height="14" className="text-qk-ink2" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <div className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-qk-red border-[1.5px] border-qk-s0"></div>
          </div>

          <button
            onClick={() => setCurrentPage('quickpropose')}
            className="px-3 py-[6px] rounded-[10px] text-[13px] cursor-pointer transition-all duration-150 flex items-center gap-[5px] border border-qk-blue bg-qk-blue text-white hover:bg-qk-blue-d"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Quick-propose
          </button>

          <div className="w-[29px] h-[29px] rounded-full bg-qk-blue-l border-2 border-qk-blue-m flex items-center justify-center text-[11px] font-medium text-qk-blue cursor-pointer">
            SA
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Sidebar */}
        <aside className="w-[220px] bg-qk-s0 border-r border-qk-bdr flex flex-col overflow-hidden">
          <div className="pt-[5px] flex-1 overflow-y-auto">
            <div className="px-[13px] pt-[13px] pb-1 text-[10px] font-medium tracking-[1px] uppercase text-qk-ink3">Workspace</div>

            <SidebarItem icon="grid" label="Overview" badge="24" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
            <SidebarItem
              icon="zap"
              label="Quick-propose"
              badge="AI"
              badgeColor="purple"
              active={currentPage === 'quickpropose'}
              onClick={() => setCurrentPage('quickpropose')}
            />
            <SidebarItem
              icon="sparkles"
              label="Nexus AI"
              badge="Claude"
              badgeColor="purple"
              active={currentPage === 'nexusai'}
              onClick={() => setCurrentPage('nexusai')}
            />
            <SidebarItem icon="edit" label="Builder" active={currentPage === 'builder'} onClick={() => setCurrentPage('builder')} />
            <SidebarItem icon="users" label="Clients" badge="6" active={currentPage === 'clients'} onClick={() => setCurrentPage('clients')} />
            <SidebarItem icon="eye" label="Client portal" active={currentPage === 'portal'} onClick={() => setCurrentPage('portal')} />
            <SidebarItem icon="calendar" label="Scheduler" active={currentPage === 'scheduler'} onClick={() => setCurrentPage('scheduler')} />
            <SidebarItem icon="activity" label="Automations" badge="5 on" badgeColor="green" active={currentPage === 'automation'} onClick={() => setCurrentPage('automation')} />
            <SidebarItem icon="message" label="Lead forms" badge="New" badgeColor="green" active={currentPage === 'leadforms'} onClick={() => setCurrentPage('leadforms')} />
            <SidebarItem icon="book" label="Content library" active={currentPage === 'library'} onClick={() => setCurrentPage('library')} />
            <SidebarItem icon="activity" label="Projects" badge="5" badgeColor="blue" active={currentPage === 'projects'} onClick={() => setCurrentPage('projects')} />
            <SidebarItem icon="chart" label="Analytics" active={currentPage === 'analytics'} onClick={() => setCurrentPage('analytics')} />
            <SidebarItem icon="message" label="Inbox" badge="3" badgeColor="red" active={currentPage === 'inbox'} onClick={() => setCurrentPage('inbox')} />

            <div className="h-[1px] bg-qk-bdr mx-[13px] my-[5px]"></div>

            <div className="px-[13px] pt-[13px] pb-1 text-[10px] font-medium tracking-[1px] uppercase text-qk-ink3">Recent</div>
            <SidebarItem icon="file" label="Volta Goods" small onClick={() => setCurrentPage('builder')} />
            <SidebarItem icon="file" label="Opal Events" small onClick={() => setCurrentPage('builder')} />
          </div>

          <div className="p-[9px] pt-[9px] border-t border-qk-bdr">
            <div className="bg-qk-amb-l border border-qk-amb-m rounded-md px-[10px] py-2 mb-[5px] cursor-pointer" onClick={() => setCurrentPage('settings')}>
              <div className="text-[11px] mb-[1px]" style={{ color: '#92400e' }}>Pro plan · 28 days left</div>
              <div className="text-[12px] text-qk-amb font-medium">Upgrade to Business →</div>
            </div>
            <div className="flex items-center gap-2 px-2 py-[7px] rounded-md cursor-pointer transition-colors hover:bg-qk-s1">
              <div className="w-[31px] h-[31px] rounded-full bg-qk-blue-l flex items-center justify-center text-[11.5px] font-medium text-qk-blue flex-shrink-0">SA</div>
              <div>
                <div className="text-[13px] font-medium">Sofia Adeyemi</div>
                <div className="text-[11px] text-qk-ink3">sofia@studiosa.co</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'dashboard' ? '' : 'hidden'}`}>
            <Dashboard onNavigate={setCurrentPage} />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'quickpropose' ? '' : 'hidden'}`}>
            <QuickPropose onNavigate={setCurrentPage} />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'builder' ? '' : 'hidden'}`}>
            <Builder onNavigate={setCurrentPage} />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'clients' ? '' : 'hidden'}`}>
            <Clients />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'portal' ? '' : 'hidden'}`}>
            <Portal />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'scheduler' ? '' : 'hidden'}`}>
            <Scheduler />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'automation' ? '' : 'hidden'}`}>
            <Automations />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'leadforms' ? '' : 'hidden'}`}>
            <LeadForms />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'library' ? '' : 'hidden'}`}>
            <Library />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'projects' ? '' : 'hidden'}`}>
            <Projects />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'analytics' ? '' : 'hidden'}`}>
            <Analytics />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'inbox' ? '' : 'hidden'}`}>
            <Inbox />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'settings' ? '' : 'hidden'}`}>
            <Settings />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'nexusai' ? '' : 'hidden'}`}>
            <NexusAI />
          </div>
          <div className={`flex-1 overflow-hidden flex flex-col ${currentPage === 'landing' ? '' : 'hidden'}`}>
            <Landing onEnterApp={() => setCurrentPage('dashboard')} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  badge,
  badgeColor = 'gray',
  active = false,
  small = false,
  onClick
}: {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: 'gray' | 'blue' | 'red' | 'green' | 'purple';
  active?: boolean;
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

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-[9px] py-[7px] mx-[5px] my-[1px] rounded-[10px] cursor-pointer transition-all ${
        active
          ? 'bg-qk-blue-l text-qk-blue'
          : 'text-qk-ink2 hover:bg-qk-s1 hover:text-qk-ink'
      } ${small ? 'text-[12.5px]' : 'text-[13px]'}`}
    >
      <Icon name={icon} className={`w-[14px] h-[14px] flex-shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={`text-[10px] px-[5px] py-[1px] rounded-[7px] font-medium ml-auto ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    zap: <path d="M13 10V3L4 14h7v7l9-11h-7z"/>,
    sparkles: <><path d="M12 3v3M18.66 5.34l-2.12 2.12M21 12h-3M18.66 18.66l-2.12-2.12M12 21v-3M5.34 18.66l2.12-2.12M3 12h3M5.34 5.34l2.12 2.12"/><circle cx="12" cy="12" r="3"/></>,
    edit: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    message: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
    book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    file: <path d="M9 12h6M9 16h4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>,
  };

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}
