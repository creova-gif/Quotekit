import { toast } from 'sonner';

export default function Clients() {
  const clients = [
    { name: 'Marcus Chen', company: 'Volta Goods', email: 'm.chen@voltagoods.co', avatar: 'VG', color: '#dbeafe', textColor: '#1d4ed8', proposals: 3, revenue: '$28.4k', status: 'Active' },
    { name: 'Priya Sharma', company: 'Meridian Studio', email: 'priya@meridianstudio.com', avatar: 'PS', color: '#fce7f3', textColor: '#831843', proposals: 5, revenue: '$42.1k', status: 'Active' },
    { name: 'James Okafor', company: 'Clearwater Capital', email: 'j.okafor@clearwater.co', avatar: 'JO', color: '#d1fae5', textColor: '#065f46', proposals: 2, revenue: '$18.2k', status: 'Closed' },
    { name: 'Emma Torres', company: 'Opal Events', email: 'emma@opalevents.com', avatar: 'OE', color: '#f5f3ff', textColor: '#7c3aed', proposals: 4, revenue: '$35.6k', status: 'Active' },
    { name: 'David Kim', company: 'Apex Digital', email: 'd.kim@apexdigital.io', avatar: 'AD', color: '#fffbeb', textColor: '#b45309', proposals: 1, revenue: '$12.8k', status: 'Lead' },
    { name: 'Sarah Mitchell', company: 'Nova Labs', email: 'sarah@novalabs.tech', avatar: 'NL', color: '#f0fdfa', textColor: '#0d9488', proposals: 6, revenue: '$56.3k', status: 'Active' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Clients</div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New client added')}>
          + Add client
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[11px]">
        {clients.map((client, i) => (
          <div
            key={i}
            className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] px-[17px] py-[15px] cursor-pointer hover:border-[--qk-bdr2] hover:shadow-sm hover:-translate-y-[1px] transition-all"
            onClick={() => toast.info(`Viewing ${client.name}`)}
          >
            <div className="flex items-center gap-[10px] mb-[11px]">
              <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[12.5px] font-medium flex-shrink-0" style={{ background: client.color, color: client.textColor }}>
                {client.avatar}
              </div>
              <div>
                <div className="text-[13.5px] font-medium mb-[1px]">{client.name}</div>
                <div className="text-[12px] text-[--qk-ink3]">{client.company}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[6px] pt-[9px] border-t border-[--qk-bdr]">
              <div>
                <div className="text-[14px] font-medium" style={{ fontFamily: 'var(--qk-mono)' }}>{client.proposals}</div>
                <div className="text-[10.5px] text-[--qk-ink3] mt-[1px]">Proposals</div>
              </div>
              <div>
                <div className="text-[14px] font-medium" style={{ fontFamily: 'var(--qk-mono)' }}>{client.revenue}</div>
                <div className="text-[10.5px] text-[--qk-ink3] mt-[1px]">Revenue</div>
              </div>
              <div>
                <div className="text-[14px] font-medium" style={{ fontFamily: 'var(--qk-mono)' }}>{client.status}</div>
                <div className="text-[10.5px] text-[--qk-ink3] mt-[1px]">Status</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
