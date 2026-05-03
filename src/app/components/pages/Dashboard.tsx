import { toast } from 'sonner';

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="mb-5">
        <h1 className="text-[24px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>
          Good morning, <em className="italic text-[--qk-blue]">Sofia.</em>
        </h1>
        <p className="text-[13px] text-[--qk-ink2] mt-[3px]">
          3 proposals need follow-up · 1 contract awaiting signature · 1 meeting booked today at 2pm
        </p>
      </div>

      {/* AI Quick-Propose Bar */}
      <div
        onClick={() => onNavigate('quickpropose')}
        className="bg-[--qk-pur-l] border border-[--qk-pur-m] rounded-[14px] px-4 py-[14px] mb-5 flex items-center gap-3 cursor-pointer hover:bg-[--qk-pur-m] transition-colors"
      >
        <div className="w-9 h-9 bg-[--qk-pur] rounded-[10px] flex items-center justify-center flex-shrink-0">
          <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-medium mb-[1px]" style={{ color: '#4c1d95' }}>Quick-propose — draft a full proposal in 60 seconds</div>
          <div className="text-[12px] text-[--qk-pur]">Answer 5 questions. AI writes, prices, and structures your entire proposal automatically.</div>
        </div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-pur-l] border border-[--qk-pur-m] text-[--qk-pur] text-[13px] flex-shrink-0 hover:bg-[--qk-pur-m] transition-colors">
          Start now →
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-[11px] mb-5">
        <StatCard
          icon={<path d="M9 12h6M9 16h4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>}
          label="Active proposals"
          value="24"
          delta="↑ 3 this week"
          up
        />
        <StatCard
          icon={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
          label="Open rate"
          value="78%"
          delta="↑ 12% vs last mo"
          up
        />
        <StatCard
          icon={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>}
          label="Win rate"
          value="41%"
          delta="↓ 3% vs last mo"
          up={false}
        />
        <StatCard
          icon={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>}
          label="Revenue closed"
          value="$28.4k"
          delta="↑ $4.2k"
          up
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[1fr_1fr_320px] gap-4 mb-4">
        <Card title="Recent proposals" action="View all →" onAction={() => onNavigate('builder')}>
          <ProposalList />
        </Card>

        <Card title="Today's schedule" action="Manage →" onAction={() => onNavigate('scheduler')}>
          <div className="p-4">
            <div className="flex items-center gap-[10px] px-[11px] py-[9px] bg-[--qk-blue-l] border border-[--qk-blue-m] rounded-[10px] mb-[7px] cursor-pointer hover:bg-[--qk-blue-m] transition-colors" onClick={() => toast.success('Opening call with Marcus')}>
              <div className="w-9 h-9 bg-[--qk-blue] rounded-[10px] flex items-center justify-center">
                <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-medium">Discovery call — Marcus Chen</div>
                <div className="text-[11.5px] text-[--qk-blue]">2:00 PM · 30 min · Google Meet</div>
              </div>
            </div>

            <div className="flex items-center gap-[10px] px-[11px] py-[9px] bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] mb-[7px] cursor-pointer hover:bg-[--qk-s2] transition-colors">
              <div className="w-9 h-9 bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-[10px] flex items-center justify-center">
                <svg width="14" height="14" fill="none" stroke="var(--qk-grn)" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-medium">Strategy review — Opal Events</div>
                <div className="text-[11.5px] text-[--qk-ink3]">4:30 PM · 60 min · Zoom</div>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="text-[12px] text-[--qk-blue] cursor-pointer hover:underline" onClick={() => onNavigate('scheduler')}>+ Schedule meeting</div>
            </div>
          </div>
        </Card>

        <Card title="Activity" action="Mark read">
          <ActivityFeed />
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          title="Revenue · 6 months"
          headerRight={<div className="text-[12px] text-[--qk-ink3]">Target: <strong className="text-[--qk-grn]">$45k</strong></div>}
        >
          <div className="flex items-end gap-[5px] h-[90px] px-[17px] py-2 pb-3">
            {[18, 22, 31, 28, 35, 42].map((height, i) => (
              <div key={i} className="flex-1 bg-[--qk-blue] rounded-t-sm" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </Card>

        <Card title="Automation activity" action="View all →" onAction={() => onNavigate('automation')}>
          <AutomationFeed />
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, delta, up }: any) {
  return (
    <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-4 cursor-pointer hover:border-[--qk-bdr2] hover:shadow-sm transition-all">
      <div className="text-[11.5px] text-[--qk-ink3] mb-1 flex items-center gap-1">
        <svg className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          {icon}
        </svg>
        {label}
      </div>
      <div className="text-[26px] tracking-[-1px] mb-[2px]" style={{ fontFamily: 'var(--qk-serif)' }}>{value}</div>
      <div className={`text-[11.5px] inline-flex items-center px-[6px] py-[2px] rounded-full ${up ? 'bg-[--qk-grn-l] text-[--qk-grn]' : 'bg-[--qk-red-l] text-[--qk-red]'}`}>
        {delta}
      </div>
    </div>
  );
}

function Card({ title, action, onAction, children, headerRight }: any) {
  return (
    <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] overflow-hidden">
      <div className="px-[17px] py-[13px] border-b border-[--qk-bdr] flex items-center justify-between">
        <div className="text-[13.5px] font-medium">{title}</div>
        {headerRight || (action && <div className="text-[12px] text-[--qk-blue] cursor-pointer hover:underline" onClick={onAction}>{action}</div>)}
      </div>
      {children}
    </div>
  );
}

function ProposalList() {
  const proposals = [
    { name: 'Volta Goods', status: 'viewed', value: '$9,850', client: 'VG', color: '#dbeafe', textColor: '#1d4ed8' },
    { name: 'Opal Events', status: 'sent', value: '$12,400', client: 'OE', color: '#f5f3ff', textColor: '#7c3aed' },
    { name: 'Meridian Studio', status: 'draft', value: '$6,200', client: 'MS', color: '#fce7f3', textColor: '#831843' },
  ];

  return (
    <>
      {proposals.map((p, i) => (
        <div key={i} className="flex items-center gap-[11px] px-[17px] py-[10px] border-b border-[--qk-bdr] last:border-0 hover:bg-[--qk-s1] cursor-pointer transition-colors">
          <div className="w-[33px] h-[33px] rounded-[10px] flex items-center justify-center text-[12px] font-medium flex-shrink-0" style={{ background: p.color, color: p.textColor }}>
            {p.client}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-medium truncate">{p.name}</div>
            <div className="text-[12px] text-[--qk-ink3]">
              <Badge status={p.status} />
            </div>
          </div>
          <div className="text-[13px] font-medium text-right flex-shrink-0" style={{ fontFamily: 'var(--qk-mono)' }}>{p.value}</div>
        </div>
      ))}
    </>
  );
}

function ActivityFeed() {
  const activities = [
    { type: 'opened', name: 'Marcus Chen', proposal: 'Volta Goods', time: '2 min ago' },
    { type: 'sent', name: 'You', proposal: 'Meridian Studio', time: '1 hour ago' },
    { type: 'signed', name: 'Priya Sharma', proposal: 'Opal Events', time: '3 hours ago' },
  ];

  return (
    <>
      {activities.map((a, i) => (
        <div key={i} className="flex items-start gap-2 px-3 py-[9px] border-b border-[--qk-bdr] last:border-0 text-[12.5px] text-[--qk-ink2] leading-[1.4]">
          <div className="w-[7px] h-[7px] rounded-full mt-[4px] flex-shrink-0" style={{ background: a.type === 'opened' ? 'var(--qk-blue)' : a.type === 'signed' ? 'var(--qk-grn)' : 'var(--qk-amb)' }}></div>
          <div className="flex-1">
            <strong className="text-[--qk-ink] font-medium">{a.name}</strong> {a.type} {a.proposal}
            <div className="text-[10px] text-[--qk-ink4] mt-[2px]">{a.time}</div>
          </div>
        </div>
      ))}
    </>
  );
}

function AutomationFeed() {
  const automations = [
    { action: 'Sent deposit invoice', client: 'Marcus Chen', time: '5 min ago' },
    { action: 'Created project', client: 'Volta Goods', time: '12 min ago' },
    { action: 'Sent kickoff form', client: 'Opal Events', time: '1 hour ago' },
  ];

  return (
    <>
      {automations.map((a, i) => (
        <div key={i} className="flex items-start gap-2 px-3 py-[9px] border-b border-[--qk-bdr] last:border-0 text-[12.5px] text-[--qk-ink2] leading-[1.4]">
          <div className="w-[7px] h-[7px] rounded-full bg-[--qk-grn] mt-[4px] flex-shrink-0"></div>
          <div className="flex-1">
            <strong className="text-[--qk-ink] font-medium">{a.action}</strong> → {a.client}
            <div className="text-[10px] text-[--qk-ink4] mt-[2px]">{a.time}</div>
          </div>
        </div>
      ))}
    </>
  );
}

function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-[--qk-s1] text-[--qk-ink3] before:bg-[--qk-ink4]',
    sent: 'bg-[--qk-amb-l] text-[--qk-amb] before:bg-[--qk-amb]',
    viewed: 'bg-[--qk-blue-l] text-[--qk-blue] before:bg-[--qk-blue]',
    accepted: 'bg-[--qk-grn-l] text-[--qk-grn] before:bg-[--qk-grn]',
    signed: 'bg-[--qk-pur-l] text-[--qk-pur] before:bg-[--qk-pur]',
  };

  return (
    <span className={`inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[11px] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
