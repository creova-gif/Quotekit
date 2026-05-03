import { toast } from 'sonner';

export default function Automations() {
  const automations = [
    { name: 'Post-acceptance workflow', desc: '5-step sequence after client accepts proposal', runs: 143, active: true },
    { name: 'Follow-up reminders', desc: 'Auto-follow-up on proposals opened but not responded', runs: 89, active: true },
    { name: 'Invoice payment chase', desc: 'Reminder 3 days before and after due date', runs: 67, active: true },
    { name: 'Welcome sequence', desc: 'Kickoff email + questionnaire on project start', runs: 52, active: true },
    { name: 'Review request', desc: 'Request testimonial 2 weeks after project close', runs: 38, active: false },
  ];

  const flowSteps = [
    { title: 'Create project from template', detail: 'Instantly · Uses "Brand & Web" template', color: 'var(--qk-blue)' },
    { title: 'Send deposit invoice', detail: '5 min delay · $3,000 via Stripe', color: 'var(--qk-grn)' },
    { title: 'Send kickoff questionnaire', detail: '10 min delay · Pre-project form', color: 'var(--qk-pur)' },
    { title: 'Send booking link', detail: '15 min delay · Discovery call scheduler', color: 'var(--qk-tel)' },
    { title: 'Follow-up if deposit unpaid', detail: '3 days later · If invoice status = unpaid', color: 'var(--qk-amb)' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Automations</div>
        <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('New automation created')}>
          + New automation
        </button>
      </div>

      {/* Automation List */}
      <div className="flex flex-col gap-[10px] mb-[18px]">
        {automations.map((auto, i) => {
          const colors = ['blue', 'grn', 'pur', 'tel', 'amb'];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`bg-[--qk-s0] border rounded-[14px] px-4 py-[14px] flex items-start gap-3 cursor-pointer hover:border-[--qk-bdr2] hover:shadow-sm transition-all ${
                i === 0 ? 'border-l-[3px] border-l-[--qk-blue]' : 'border-[--qk-bdr]'
              }`}
              onClick={() => toast.info(`Viewing ${auto.name}`)}
            >
              <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[--qk-${color}-l]`}>
                <svg className={`w-4 h-4 text-[--qk-${color}]`} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-medium mb-[2px]">{auto.name}</div>
                <div className="text-[12.5px] text-[--qk-ink2]">{auto.desc}</div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="text-[11.5px] text-[--qk-ink3]">{auto.runs} runs</div>
                <div className={`w-[31px] h-[17px] rounded-[9px] cursor-pointer relative transition-all flex-shrink-0 ${auto.active ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'}`}>
                  <div className={`absolute w-[13px] h-[13px] bg-white rounded-full top-[2px] transition-all shadow-sm ${auto.active ? 'left-[16px]' : 'left-[2px]'}`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow Builder */}
      <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-[18px]">
        <div className="text-[15px] font-medium mb-4">Post-acceptance workflow</div>
        {flowSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-[14px] last:mb-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: step.color }}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="w-[2px] flex-1 min-h-5 bg-[--qk-bdr] mt-1"></div>
              )}
            </div>
            <div className="flex-1 pb-[14px]">
              <div className="text-[13px] font-medium mb-[3px]">{step.title}</div>
              <div className="text-[12px] text-[--qk-ink2] leading-[1.5]">{step.detail}</div>
            </div>
          </div>
        ))}
        <div className="border-[1.5px] border-dashed border-[--qk-bdr] rounded-[14px] px-3 py-3 text-center cursor-pointer text-[12.5px] text-[--qk-ink3] hover:border-[--qk-blue-m] hover:bg-[--qk-blue-l] hover:text-[--qk-blue] transition-all" onClick={() => toast.info('Add step')}>
          + Add step
        </div>
      </div>
    </div>
  );
}
