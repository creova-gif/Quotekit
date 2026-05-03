import { useState } from 'react';
import { toast } from 'sonner';

export default function Builder({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('ai');
  const [revenue, setRevenue] = useState(20000);
  const [conversionLift, setConversionLift] = useState(15);

  const calculateROI = () => {
    const additionalRevenue = revenue * (conversionLift / 100);
    const annualIncrease = additionalRevenue * 12;
    const investment = 9850;
    const roi = ((annualIncrease - investment) / investment) * 100;

    return {
      additional: additionalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      annual: annualIncrease.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
      roi: Math.round(roi) + '%'
    };
  };

  const roiData = calculateROI();

  return (
    <>
      {/* Builder Topbar */}
      <div className="h-12 bg-[--qk-s0] border-b border-[--qk-bdr] px-[18px] flex items-center gap-[9px] flex-shrink-0">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1 text-[--qk-ink3] text-[13px] cursor-pointer hover:text-[--qk-ink] transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Proposals
        </div>
        <span className="text-[--qk-bdr2]">/</span>
        <div className="text-[13.5px] font-medium flex-1">Brand Identity & Website — Volta Goods</div>
        <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[11px] bg-[--qk-s1] text-[--qk-ink3] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[--qk-ink4]">
          Draft
        </span>
        <div className="flex items-center gap-1 text-[11px] text-[--qk-grn]">
          <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Auto-saved
        </div>
        <div className="ml-auto flex gap-[6px]">
          <button className="px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1] transition-all flex items-center gap-[5px]" onClick={() => toast.info('Preview opened')}>
            <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </button>
          <button className="px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1] transition-all flex items-center gap-[5px]" onClick={() => toast.success('Exported PDF')}>
            <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </button>
          <button className="px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-blue] bg-[--qk-blue] text-white hover:bg-[--qk-blue-d] transition-all flex items-center gap-[5px]" onClick={() => toast.success('✓ Sent to marcus@voltagoods.co')}>
            <svg className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* Builder Content */}
      <div className="flex-1 grid grid-cols-[1fr_294px] overflow-hidden">
        {/* Document */}
        <div className="overflow-y-auto bg-[--qk-bg] p-[22px]">
          <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] max-w-[720px] mx-auto shadow-xl overflow-hidden">
            {/* Document Header */}
            <div className="px-[38px] pt-7 pb-6 bg-[--qk-ink] flex justify-between items-start">
              <div className="flex items-center gap-[11px]">
                <div className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.14)' }}>
                  <svg className="w-[19px] h-[19px]" stroke="#fff" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-medium text-white" style={{ fontFamily: 'var(--qk-serif)' }}>Sofia Adeyemi Studio</div>
                  <div className="text-[11px] mt-[1px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Brand · Web · Strategy</div>
                </div>
              </div>
              <div className="text-right text-[11px] leading-[1.9]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <div>Proposal <strong className="text-white font-medium">#QK-0041</strong></div>
                <div>Apr 7, 2026</div>
                <div>Valid: <strong className="text-white font-medium">May 7, 2026</strong></div>
              </div>
            </div>

            {/* Cover Section */}
            <DocSection>
              <SectionLabel>Cover</SectionLabel>
              <input
                className="w-full text-[22px] tracking-[-0.4px] border-none outline-none bg-transparent text-[--qk-ink] mb-[3px] leading-[1.25]"
                style={{ fontFamily: 'var(--qk-serif)' }}
                defaultValue="Brand Identity & Website — Full Package"
              />
              <input
                className="w-full text-[13px] text-[--qk-ink3] border-none outline-none bg-transparent"
                defaultValue="Prepared for Volta Goods · April 2026"
              />
            </DocSection>

            {/* Client Section */}
            <DocSection>
              <SectionLabel>Prepared for</SectionLabel>
              <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] px-[15px] py-[13px] flex gap-[11px]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium bg-[#dbeafe] text-[#1d4ed8]">VG</div>
                <div>
                  <div className="text-[13.5px] font-medium mb-[1px]">Marcus Chen — Volta Goods</div>
                  <div className="text-[12px] text-[--qk-ink3]">m.chen@voltagoods.co</div>
                  <div className="flex gap-1 mt-[5px] flex-wrap">
                    <span className="text-[11px] text-[--qk-ink2] bg-[--qk-s0] border border-[--qk-bdr] rounded-full px-[7px] py-[1px]">Toronto, ON</span>
                    <span className="text-[11px] text-[--qk-ink2] bg-[--qk-s0] border border-[--qk-bdr] rounded-full px-[7px] py-[1px]">E-commerce</span>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* ROI Calculator */}
            <DocSection>
              <SectionLabel>ROI calculator</SectionLabel>
              <div className="border border-[--qk-bdr] rounded-[14px] bg-[--qk-grn-l] p-4">
                <div className="text-[13px] font-medium text-[--qk-grn] mb-3 flex items-center gap-[7px]">
                  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Your projected return on investment
                </div>
                <div className="mb-[10px]">
                  <div className="text-[12px] mb-1 flex justify-between" style={{ color: '#14532d' }}>
                    <span>Current monthly revenue</span>
                    <span>${revenue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="1000"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full accent-[--qk-grn]"
                  />
                </div>
                <div className="mb-[10px]">
                  <div className="text-[12px] mb-1 flex justify-between" style={{ color: '#14532d' }}>
                    <span>Expected conversion lift</span>
                    <span>{conversionLift}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={conversionLift}
                    onChange={(e) => setConversionLift(Number(e.target.value))}
                    className="w-full accent-[--qk-grn]"
                  />
                </div>
                <div className="bg-white border border-[--qk-grn-m] rounded-[10px] px-[14px] py-3 mt-[10px]">
                  <ROIRow label="Additional monthly revenue" value={roiData.additional} />
                  <ROIRow label="Annual revenue increase" value={roiData.annual} />
                  <ROIRow label="Investment" value="$9,850" />
                  <div className="flex justify-between text-[14px] font-medium text-[--qk-grn] pt-2 mt-[6px] border-t border-[--qk-grn-m]">
                    <span>ROI at 12 months</span>
                    <strong style={{ fontFamily: 'var(--qk-mono)' }}>{roiData.roi}</strong>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Testimonials */}
            <DocSection>
              <SectionLabel>What clients say</SectionLabel>
              <div className="grid grid-cols-2 gap-[10px]">
                <Testimonial
                  quote="Sofia's team transformed our brand completely. The proposal was clear, the delivery was flawless."
                  name="Priya Sharma"
                  company="Meridian Studio"
                  avatar="PS"
                  color="#fce7f3"
                  textColor="#831843"
                />
                <Testimonial
                  quote="Best investment we made. Revenue up 40% in 3 months after the rebrand and new site."
                  name="James Okafor"
                  company="Clearwater Capital"
                  avatar="JO"
                  color="#d1fae5"
                  textColor="#065f46"
                />
              </div>
            </DocSection>

            {/* Add Section Button */}
            <div className="px-3 py-3 text-center border-t border-dashed border-[--qk-bdr]">
              <button className="inline-flex items-center gap-[5px] text-[12.5px] text-[--qk-ink3] cursor-pointer px-[14px] py-[5px] rounded-[14px] border border-dashed border-[--qk-bdr] bg-transparent hover:bg-[--qk-s1] hover:text-[--qk-ink] transition-all" onClick={() => toast.info('Section picker')}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add section
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="border-l border-[--qk-bdr] bg-[--qk-s0] flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[--qk-bdr] flex-shrink-0 overflow-x-auto">
            {['AI', 'Sign', 'Invoice', 'Pricing', 'Send', 'Track', 'Auto'].map(tab => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 min-w-[52px] px-1 py-[10px] text-center text-[11px] cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? 'text-[--qk-blue] border-[--qk-blue] font-medium'
                    : 'text-[--qk-ink3] border-transparent hover:text-[--qk-ink2]'
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-[13px] flex-1 overflow-y-auto flex flex-col gap-[11px]">
            {activeTab === 'ai' && <AIPanel />}
            {activeTab === 'auto' && <AutoPanel />}
            {activeTab === 'track' && <TrackPanel />}
          </div>
        </div>
      </div>
    </>
  );
}

function DocSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group px-[38px] py-[22px] border-b border-[--qk-bdr] last:border-0 outline-2 outline-transparent hover:outline-[--qk-blue-m] transition-all">
      <div className="absolute top-[5px] right-[5px] opacity-0 group-hover:opacity-100 flex gap-[3px] transition-opacity z-10">
        <button className="px-[6px] py-[3px] bg-[--qk-s0] border border-[--qk-bdr] rounded-md text-[10.5px] text-[--qk-ink2] hover:bg-[--qk-s1] hover:border-[--qk-bdr2] transition-all" onClick={() => toast.info('Duped')}>Dupe</button>
        <button className="px-[6px] py-[3px] bg-[--qk-s0] border border-[--qk-bdr] rounded-md text-[10.5px] text-[--qk-ink2] hover:bg-[--qk-red-l] hover:border-[--qk-red-m] hover:text-[--qk-red] transition-all" onClick={() => toast.info('Removed')}>Remove</button>
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9.5px] font-medium tracking-[1px] uppercase text-[--qk-ink4] mb-[9px] flex items-center gap-[5px]">
      <div className="grid grid-cols-2 gap-[2px] w-2 cursor-grab">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="w-[2px] h-[2px] rounded-full bg-[--qk-ink4]"></span>
        ))}
      </div>
      {children}
    </div>
  );
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] py-[2px]" style={{ color: '#14532d' }}>
      <span>{label}</span>
      <strong style={{ fontFamily: 'var(--qk-mono)' }} className="font-medium">{value}</strong>
    </div>
  );
}

function Testimonial({ quote, name, company, avatar, color, textColor }: any) {
  return (
    <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] px-[14px] py-[13px]">
      <div className="text-[13px] text-[--qk-ink2] leading-[1.6] mb-[10px] italic" style={{ fontFamily: 'var(--qk-serif)' }}>
        "{quote}"
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: color, color: textColor }}>
          {avatar}
        </div>
        <div>
          <div className="text-[12px] font-medium">{name}</div>
          <div className="text-[11px] text-[--qk-ink3]">{company}</div>
        </div>
      </div>
    </div>
  );
}

function AIPanel() {
  return (
    <>
      <div className="bg-[--qk-pur-l] border border-[--qk-pur-m] rounded-[14px] p-3">
        <div className="flex items-center gap-[6px] mb-[9px]">
          <div className="w-[21px] h-[21px] bg-[--qk-pur] rounded-[5px] flex items-center justify-center">
            <svg className="w-[11px] h-[11px]" stroke="#fff" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </div>
          <div className="text-[12.5px] font-medium" style={{ color: '#4c1d95' }}>AI suggestions</div>
          <div className="ml-auto text-[10px] text-[--qk-pur] bg-[--qk-pur-m] px-[6px] py-[2px] rounded-[7px]">3 insights</div>
        </div>
        <div className="bg-white border border-[--qk-pur-m] rounded-[10px] px-[10px] py-2 text-[12px] leading-[1.5] cursor-pointer hover:bg-[--qk-pur-l] hover:border-[#c4b5fd] transition-all mb-[5px]" style={{ color: '#3b0764' }} onClick={() => toast.success('Adding social proof…')}>
          <div className="text-[10px] font-medium text-[--qk-pur] mb-[2px] flex items-center gap-[3px]">
            <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Conv. +34%
          </div>
          Video intro added. Proposals with video close 34% faster.
        </div>
        <div className="bg-white border border-[--qk-pur-m] rounded-[10px] px-[10px] py-2 text-[12px] leading-[1.5] cursor-pointer hover:bg-[--qk-pur-l] hover:border-[#c4b5fd] transition-all mb-[5px]" style={{ color: '#3b0764' }} onClick={() => toast.success('SEO add-on added…')}>
          <div className="text-[10px] font-medium text-[--qk-pur] mb-[2px] flex items-center gap-[3px]">
            <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Upsell
          </div>
          Add optional SEO audit at $400 — increases avg. deal 5%.
        </div>
        <button className="w-full px-[7px] py-[7px] bg-[--qk-pur] text-white border-none rounded-[10px] text-[12px] cursor-pointer hover:bg-[#6d28d9] transition-colors" style={{ fontFamily: 'var(--qk-sans)' }} onClick={() => toast.success('✓ All applied')}>
          Apply all suggestions
        </button>
      </div>

      <div className="border border-[--qk-bdr] rounded-[14px] overflow-hidden">
        <div className="px-3 py-2 bg-[--qk-s1] border-b border-[--qk-bdr] flex items-center justify-between text-[12.5px] font-medium">
          <span>Score: 89/100</span>
          <span className="text-[11px] text-[--qk-grn]">Strong</span>
        </div>
        <InsightRow color="var(--qk-grn)" text="Video intro + ROI calculator added. Excellent engagement drivers." />
        <InsightRow color="var(--qk-amb)" text="Pricing 18% below median. Raise brand design to $4,400." />
        <InsightRow color="var(--qk-grn)" text="Timeline and payment terms are clear." />
      </div>
    </>
  );
}

function AutoPanel() {
  return (
    <>
      <div className="text-[13px] font-medium mb-[10px]">Post-acceptance automation</div>
      <div className="bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-[14px] p-3 mb-[10px]">
        <div className="text-[12px] font-medium text-[--qk-grn] mb-[6px]">When this proposal is accepted:</div>
        <div className="flex flex-col gap-[6px]">
          <AutoStep text="Create project from template" />
          <AutoStep text="Send deposit invoice ($3,000)" />
          <AutoStep text="Send kickoff questionnaire" />
          <AutoStep text="Book discovery call link" />
        </div>
      </div>
      <button className="w-full px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] flex items-center justify-center hover:bg-[--qk-blue-d] transition-colors" onClick={() => toast.info('Edit automation')}>
        Edit automation →
      </button>
    </>
  );
}

function TrackPanel() {
  return (
    <>
      <div className="border border-[--qk-bdr] rounded-[14px] overflow-hidden">
        <div className="px-3 py-2 bg-[--qk-s1] border-b border-[--qk-bdr] flex items-center justify-between text-[12.5px] font-medium">
          <span>Client activity</span>
          <div className="flex items-center gap-1 text-[11px] text-[--qk-grn]">
            <div className="w-[6px] h-[6px] rounded-full bg-[--qk-grn] animate-pulse"></div>
            Live
          </div>
        </div>
        <TrackItem
          color="var(--qk-blue)"
          text={<><strong className="text-[--qk-ink] font-medium">Marcus</strong> opened the proposal</>}
          time="Today, 11:42 AM · 4 min 18 sec"
          progress={72}
          detail="Most time: Pricing (2:14) → ROI calc (1:04)"
        />
        <TrackItem
          color="var(--qk-grn)"
          text={<><strong className="text-[--qk-ink] font-medium">Delivered</strong> via email</>}
          time="Today, 9:15 AM"
        />
      </div>

      <div className="bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-[14px] p-3">
        <div className="text-[12px] font-medium text-[--qk-grn] mb-[3px]">Engagement signal</div>
        <div className="text-[12px] leading-[1.5]" style={{ color: '#14532d' }}>Marcus spent 4:18 — well above avg 2:30. Lingered on ROI calculator & pricing. Call now to discuss budget options.</div>
      </div>

      <button className="w-full px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] flex items-center justify-center hover:bg-[--qk-s1] transition-colors" onClick={() => toast.success('Follow-up scheduled 2pm today')}>
        Schedule follow-up
      </button>
    </>
  );
}

function InsightRow({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-[9px] border-b border-[--qk-bdr] last:border-0 text-[12px] text-[--qk-ink2] leading-[1.5]">
      <div className="w-[7px] h-[7px] rounded-full mt-1 flex-shrink-0" style={{ background: color }}></div>
      <div>{text}</div>
    </div>
  );
}

function AutoStep({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[7px] text-[12px]" style={{ color: '#14532d' }}>
      <div className="w-[18px] h-[18px] bg-[--qk-grn] rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-2 h-2" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      {text}
    </div>
  );
}

function TrackItem({ color, text, time, progress, detail }: any) {
  return (
    <div className="flex items-start gap-2 px-3 py-[9px] border-b border-[--qk-bdr] last:border-0">
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: color }}></div>
        {progress && <div className="w-[1px] flex-1 min-h-3 bg-[--qk-bdr] mt-[3px]"></div>}
      </div>
      <div className="text-[12.5px] text-[--qk-ink2] leading-[1.4] flex-1">
        {text}
        <div className="text-[10px] text-[--qk-ink4] mt-[2px]">{time}</div>
        {progress && (
          <>
            <div className="h-[3px] bg-[--qk-s1] rounded-[2px] overflow-hidden mt-[5px]">
              <div className="h-full bg-[--qk-blue] rounded-[2px]" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-[10px] text-[--qk-ink3] mt-[3px]">{detail}</div>
          </>
        )}
      </div>
    </div>
  );
}
