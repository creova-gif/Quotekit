import { toast } from 'sonner';

export default function Library() {
  const blocks = [
    { name: 'Standard scope', desc: 'Discovery, design, dev, support', category: 'Scope', uses: 24, icon: 'file' },
    { name: '3-tier pricing', desc: 'Starter, Recommended, Growth', category: 'Pricing', uses: 18, icon: 'dollar' },
    { name: 'ROI calculator', desc: 'Interactive revenue calculator', category: 'Interactive', uses: 15, icon: 'chart' },
    { name: 'Client testimonials', desc: '5 featured client quotes', category: 'Social proof', uses: 12, icon: 'star' },
    { name: 'Payment terms', desc: '30/40/30 milestone schedule', category: 'Legal', uses: 22, icon: 'calendar' },
    { name: 'FAQ section', desc: '8 common client questions', category: 'Support', uses: 9, icon: 'help' },
    { name: 'Video intro block', desc: 'Embedded Loom/YouTube', category: 'Media', uses: 7, icon: 'play' },
    { name: 'Legal terms', desc: 'Standard contract clauses', category: 'Legal', uses: 19, icon: 'document' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Content <em className="italic text-[--qk-blue]">library</em></div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New block created')}>
          + New block
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[10px]">
        {blocks.map((block, i) => {
          const colors = ['blue', 'grn', 'pur', 'tel', 'amb'];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] px-[14px] py-[13px] cursor-pointer hover:border-[--qk-bdr2] hover:shadow-sm hover:-translate-y-[1px] transition-all"
              onClick={() => toast.success(`Inserted ${block.name}`)}
            >
              <div className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center mb-2 bg-[--qk-${color}-l]`}>
                <svg className={`w-[14px] h-[14px] text-[--qk-${color}]`} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  {block.icon === 'file' && <path d="M9 12h6M9 16h4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>}
                  {block.icon === 'dollar' && <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>}
                  {block.icon === 'chart' && <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>}
                  {block.icon === 'star' && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}
                  {block.icon === 'calendar' && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                  {block.icon === 'help' && <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
                  {block.icon === 'play' && <polygon points="5 3 19 12 5 21 5 3"/>}
                  {block.icon === 'document' && <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>}
                </svg>
              </div>
              <div className="text-[13px] font-medium mb-[2px]">{block.name}</div>
              <div className="text-[11.5px] text-[--qk-ink3]">{block.desc}</div>
              <div className="text-[11px] text-[--qk-ink3] mt-[7px] flex gap-[10px]">
                <span>{block.category}</span>
                <span>·</span>
                <span>{block.uses} uses</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
