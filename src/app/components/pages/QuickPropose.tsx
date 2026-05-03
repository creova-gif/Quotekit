import { useState } from 'react';
import { toast } from 'sonner';

export default function QuickPropose({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [tone, setTone] = useState('Professional & concise');
  const [extras, setExtras] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const generateProposal = () => {
    setGenerating(true);
    const steps = [
      { text: 'Writing scope of work…', duration: 1000 },
      { text: 'Generating pricing packages…', duration: 1200 },
      { text: 'Creating timeline…', duration: 800 },
      { text: 'Building ROI calculator…', duration: 1000 },
      { text: 'Finalizing proposal…', duration: 800 },
    ];

    let currentProgress = 0;
    steps.forEach((s, i) => {
      setTimeout(() => {
        setProgressText(s.text);
        setProgress(((i + 1) / steps.length) * 100);

        if (i === steps.length - 1) {
          setTimeout(() => {
            toast.success('✓ Proposal generated!');
            onNavigate('builder');
          }, s.duration);
        }
      }, currentProgress);
      currentProgress += s.duration;
    });
  };

  const toggleExtra = (extra: string) => {
    setExtras(prev =>
      prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px] flex items-start justify-center">
      <div className="w-full max-w-[600px]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[--qk-pur] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div className="text-[24px] tracking-[-0.3px] mb-1" style={{ fontFamily: 'var(--qk-serif)' }}>Quick-propose</div>
          <div className="text-[13.5px] text-[--qk-ink3]">Answer 5 questions — AI writes your complete proposal</div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-[5px] mb-[22px] justify-center">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-[7px] h-[7px] rounded-full transition-colors ${
                i <= step ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'
              }`}
            ></div>
          ))}
        </div>

        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] p-7 shadow-lg">
          {/* Step 1: Service type */}
          {step === 1 && (
            <div>
              <div className="text-[15px] font-medium mb-1">What type of work is this?</div>
              <div className="text-[13px] text-[--qk-ink3] mb-4">Pick the closest match</div>
              <div className="flex flex-wrap gap-[7px] mb-4">
                {['Brand & Identity', 'Website Design', 'Development', 'Marketing', 'Consulting', 'Photography', 'Video Production', 'Other'].map(type => (
                  <button
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`px-3 py-[6px] rounded-full text-[12.5px] border cursor-pointer transition-all ${
                      serviceType === type
                        ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                        : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-blue] hover:border-[--qk-blue] hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Client */}
          {step === 2 && (
            <div>
              <div className="text-[15px] font-medium mb-1">Who is this proposal for?</div>
              <div className="text-[13px] text-[--qk-ink3] mb-4">Select existing or add new</div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 px-3 py-[10px] bg-[--qk-blue-l] border-2 border-[--qk-blue] rounded-[14px] cursor-pointer flex items-center gap-[10px]">
                  <div className="w-8 h-8 rounded-full bg-[--qk-blue] flex items-center justify-center text-[11px] font-medium text-white">VG</div>
                  <div>
                    <div className="text-[13px] font-medium text-[--qk-blue]">Marcus Chen</div>
                    <div className="text-[11.5px] text-[--qk-blue]">Volta Goods</div>
                  </div>
                </div>
                <div className="flex-1 px-3 py-[10px] bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] cursor-pointer flex items-center gap-[10px] hover:bg-[--qk-s2] transition-colors" onClick={() => toast.info('Add new client')}>
                  <div className="w-8 h-8 rounded-full bg-[--qk-s2] flex items-center justify-center">
                    <svg width="14" height="14" fill="none" stroke="var(--qk-ink3)" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <div className="text-[13px] text-[--qk-ink2]">New client</div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Project details */}
          {step === 3 && (
            <div>
              <div className="text-[15px] font-medium mb-1">Describe the project in a sentence</div>
              <div className="text-[13px] text-[--qk-ink3] mb-4">AI will expand this into full proposal copy</div>
              <textarea
                className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13.5px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0] mb-3 min-h-[80px] resize-y"
                style={{ fontFamily: 'var(--qk-sans)' }}
                placeholder="e.g. Complete brand identity and Shopify storefront for a Toronto-based e-commerce company selling premium outdoor gear…"
              ></textarea>
              <div className="grid grid-cols-2 gap-[10px] mb-3">
                <div>
                  <div className="text-[12.5px] font-medium mb-[5px] text-[--qk-ink]">Estimated budget</div>
                  <input
                    className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13.5px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0]"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                    placeholder="e.g. $8,000–$12,000"
                  />
                </div>
                <div>
                  <div className="text-[12.5px] font-medium mb-[5px] text-[--qk-ink]">Timeline</div>
                  <input
                    className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13.5px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0]"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                    placeholder="e.g. 8–10 weeks"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Tone & extras */}
          {step === 4 && (
            <div>
              <div className="text-[15px] font-medium mb-1">What tone should the proposal take?</div>
              <div className="text-[13px] text-[--qk-ink3] mb-4">Matches your brand voice</div>
              <div className="flex flex-wrap gap-[7px] mb-4">
                {['Professional & concise', 'Warm & relationship-focused', 'Bold & confident', 'Creative & expressive'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-[6px] rounded-full text-[12.5px] border cursor-pointer transition-all ${
                      tone === t
                        ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                        : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-blue] hover:border-[--qk-blue] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <div className="text-[12.5px] font-medium mb-[5px]">Optional extras to include</div>
                <div className="flex flex-wrap gap-[7px]">
                  {['ROI calculator', 'Case study section', 'Video intro block', 'Testimonials', 'FAQ section'].map(extra => (
                    <button
                      key={extra}
                      onClick={() => toggleExtra(extra)}
                      className={`px-3 py-[6px] rounded-full text-[12.5px] border cursor-pointer transition-all ${
                        extras.includes(extra)
                          ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                          : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-blue] hover:border-[--qk-blue] hover:text-white'
                      }`}
                    >
                      {extra}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setStep(3)}
                  className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Generate */}
          {step === 5 && (
            <div className="text-center py-5">
              {!generating ? (
                <>
                  <div className="text-[15px] font-medium mb-[6px]">Ready to generate</div>
                  <div className="text-[13px] text-[--qk-ink3] mb-5">AI will write, price, and structure your full proposal based on your answers.</div>
                  <div className="bg-[--qk-pur-l] border border-[--qk-pur-m] rounded-[14px] p-[14px] text-left mb-[18px]">
                    <div className="text-[12px] font-medium mb-2" style={{ color: '#4c1d95' }}>What AI will create:</div>
                    <div className="flex flex-col gap-[5px] text-[12.5px]" style={{ color: '#3b0764' }}>
                      <div>✓ Executive summary & outcome-led scope</div>
                      <div>✓ 3-tier pricing packages (Starter / Recommended / Growth)</div>
                      <div>✓ Milestone payment schedule</div>
                      <div>✓ Project timeline & deliverables list</div>
                      <div>✓ Payment terms & revision policy</div>
                      <div>✓ ROI calculator block</div>
                    </div>
                  </div>
                  <button
                    onClick={generateProposal}
                    className="w-full px-3 py-[11px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] flex items-center justify-center gap-2 hover:bg-[--qk-blue-d] transition-colors"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Generate proposal
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={() => setStep(4)}
                      className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[18px] text-[--qk-pur] mb-[14px]" style={{ fontFamily: 'var(--qk-serif)' }}>
                    {progressText}
                  </div>
                  <div className="bg-[--qk-s1] h-[6px] rounded-[3px] overflow-hidden max-w-[280px] mx-auto">
                    <div
                      className="h-full bg-[--qk-pur] rounded-[3px] transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-[12px] text-[--qk-ink3] mt-[10px]">{Math.round(progress)}%</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
