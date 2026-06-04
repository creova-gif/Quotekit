import { useState } from 'react';
import { toast } from 'sonner';
import * as Switch from '@radix-ui/react-switch';

interface AutomationItem {
  name: string;
  desc: string;
  runs: number;
  active: boolean;
}

export default function Automations() {
  const [automations, setAutomations] = useState<AutomationItem[]>([
    { name: 'Post-acceptance workflow', desc: '5-step sequence after client accepts proposal', runs: 143, active: true },
    { name: 'Follow-up reminders', desc: 'Auto-follow-up on proposals opened but not responded', runs: 89, active: true },
    { name: 'Invoice payment chase', desc: 'Reminder 3 days before and after due date', runs: 67, active: true },
    { name: 'Welcome sequence', desc: 'Kickoff email + questionnaire on project start', runs: 52, active: true },
    { name: 'Review request', desc: 'Request testimonial 2 weeks after project close', runs: 38, active: false },
  ]);

  const flowSteps = [
    { title: 'Create project from template', detail: 'Instantly · Uses "Brand & Web" template', color: 'var(--qk-blue)' },
    { title: 'Send deposit invoice', detail: '5 min delay · $3,000 via Stripe', color: 'var(--qk-grn)' },
    { title: 'Send kickoff questionnaire', detail: '10 min delay · Pre-project form', color: 'var(--qk-pur)' },
    { title: 'Send booking link', detail: '15 min delay · Discovery call scheduler', color: 'var(--qk-tel)' },
    { title: 'Follow-up if deposit unpaid', detail: '3 days later · If invoice status = unpaid', color: 'var(--qk-amb)' },
  ];

  const handleToggleActive = (index: number, newChecked: boolean) => {
    setAutomations(prev =>
      prev.map((auto, i) => (i === index ? { ...auto, active: newChecked } : auto))
    );
    toast.success(`${automations[index].name} ${newChecked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-[30px] py-[26px]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[23px] tracking-[-0.4px]" style={{ fontFamily: 'var(--qk-serif)' }}>Automations</h1>
        <button
          type="button"
          className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] min-h-[44px] font-semibold"
          onClick={() => toast.success('New automation created')}
        >
          + New automation
        </button>
      </div>

      {/* Automation List */}
      <div className="flex flex-col gap-[10px] mb-[18px]">
        {automations.map((auto, i) => {
          const colors = ['blue', 'grn', 'pur', 'tel', 'amb'];
          const color = colors[i % colors.length];
          const switchId = `auto-switch-${i}`;
          return (
            <div
              key={i}
              className={`bg-[--qk-s0] border rounded-[14px] px-4 py-[14px] flex items-center gap-3 transition-all ${
                i === 0 ? 'border-l-[3px] border-l-[--qk-blue]' : 'border-[--qk-bdr]'
              }`}
            >
              <button
                type="button"
                className="flex items-start gap-3 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] rounded-md py-1"
                onClick={() => toast.info(`Viewing details for ${auto.name}`)}
              >
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[--qk-${color}-l]`} aria-hidden="true">
                  <svg className={`w-4 h-4 text-[--qk-${color}]`} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13.5px] font-semibold text-[--qk-ink] block">{auto.name}</span>
                  <span className="text-[12px] text-[--qk-ink2] block truncate">{auto.desc}</span>
                </div>
              </button>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-[11.5px] text-[--qk-ink3] hidden sm:inline">{auto.runs} runs</span>
                <div className="flex items-center">
                  <label htmlFor={switchId} className="sr-only">Toggle {auto.name}</label>
                  <Switch.Root
                    id={switchId}
                    checked={auto.active}
                    onCheckedChange={(checked) => handleToggleActive(i, checked)}
                    className={`w-[31px] h-[17px] rounded-[9px] relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] cursor-pointer flex-shrink-0 ${
                      auto.active ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'
                    }`}
                  >
                    <Switch.Thumb
                      className={`block w-[13px] h-[13px] bg-white rounded-full transition-transform duration-100 will-change-transform ${
                        auto.active ? 'translate-x-[16px] rtl:translate-x-[-16px]' : 'translate-x-[2px]'
                      }`}
                    />
                  </Switch.Root>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow Builder */}
      <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] p-4 md:p-[18px]">
        <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-4">Post-acceptance workflow sequence</h2>
        
        <div className="space-y-0.5">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0" aria-hidden="true">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: step.color }}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="w-[2px] h-6 bg-[--qk-bdr] my-1"></div>
                )}
              </div>
              <div className="flex-1 pb-3">
                <h3 className="text-[13.5px] font-semibold text-[--qk-ink]">{step.title}</h3>
                <p className="text-[12px] text-[--qk-ink2] leading-normal">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full mt-2 border-[1.5px] border-dashed border-[--qk-bdr] rounded-[14px] px-3 py-3 text-center cursor-pointer text-[12.5px] text-[--qk-ink3] hover:border-[--qk-blue-m] hover:bg-[--qk-blue-l] hover:text-[--qk-blue] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] min-h-[44px] font-semibold"
          onClick={() => toast.info('Add workflow step modal')}
        >
          + Add step
        </button>
      </div>
    </div>
  );
}
