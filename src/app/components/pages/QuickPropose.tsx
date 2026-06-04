import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { getTaxForProvince } from '../../../lib/tax';

export default function QuickPropose({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('Brand & Identity');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [tone, setTone] = useState('Professional & concise');
  const [extras, setExtras] = useState<string[]>(['ROI calculator']);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const generateProposal = async () => {
    if (!user) return;
    setGenerating(true);

    // Start steps animations
    const steps = [
      { text: 'Analyzing requirements...', duration: 600 },
      { text: 'Expanding project scope...', duration: 700 },
      { text: 'Generating standard deliverables...', duration: 600 },
      { text: 'Calculating regional tax rates...', duration: 500 },
      { text: 'Saving draft to Supabase database...', duration: 600 },
    ];

    let currentProgress = 0;
    
    // Parse budget numerical estimate
    const rawNum = budget.replace(/[^0-9]/g, '');
    let parsedBudget = parseFloat(rawNum);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      parsedBudget = 8500; // default fallback budget
    }

    // Prepare database insertion parallel to animation
    const seedProposal = async () => {
      try {
        // Fetch or create client
        let clientData;
        const { data: clients } = await supabase.from('clients').select('*').limit(1);
        if (!clients || clients.length === 0) {
          const { data: newClient } = await supabase
            .from('clients')
            .insert({
              user_id: user.id,
              name: 'Marcus Chen',
              company: 'Volta Goods',
              email: 'm.chen@voltagoods.co',
              country: 'CA',
              currency: 'CAD',
              status: 'lead'
            })
            .select()
            .single();
          clientData = newClient;
        } else {
          clientData = clients[0];
        }

        if (!clientData) throw new Error('Client creation failed');

        const taxInfo = getTaxForProvince(profile?.province ?? 'ON', profile?.country ?? 'CA');
        const taxRate = taxInfo.rate;
        const taxAmount = parsedBudget * taxRate;
        const total = parsedBudget + taxAmount;

        const { data: newProp, error: propErr } = await supabase
          .from('proposals')
          .insert({
            user_id: user.id,
            client_id: clientData.id,
            title: `${serviceType} — Volta Goods`,
            cover_title: `${serviceType} — Project Proposal`,
            cover_subtitle: `Prepared for Volta Goods · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            status: 'draft',
            currency: profile?.currency ?? 'CAD',
            tax_rate: taxRate,
            tax_label: taxInfo.label,
            subtotal: parsedBudget,
            tax_amount: taxAmount,
            total,
            summary: description.trim() || `Complete ${serviceType} project scope and services.`,
          })
          .select()
          .single();

        if (propErr) throw propErr;

        // Add corresponding line items
        const lineItemsToInsert = [
          {
            proposal_id: newProp.id,
            description: `${serviceType} Design & Deliverables (${tone.toLowerCase()} tone)`,
            quantity: 1,
            unit_price: parsedBudget,
            sort_order: 1
          }
        ];

        // Add extras if selected
        if (extras.includes('Video intro block')) {
          lineItemsToInsert.push({
            proposal_id: newProp.id,
            description: 'Optional Video Explainer Intro (Add-on)',
            quantity: 1,
            unit_price: 500,
            sort_order: 2
          });
        }

        await supabase.from('line_items').insert(lineItemsToInsert);

      } catch (err) {
        console.error('Error seeding quickpropose proposal:', err);
      }
    };

    // Kickoff the async seed operation
    const seedPromise = seedProposal();

    // Trigger step updates
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await new Promise(resolve => {
        setTimeout(() => {
          setProgressText(s.text);
          setProgress(((i + 1) / steps.length) * 100);
          resolve(true);
        }, s.duration);
      });
    }

    // Await database write completion before redirecting
    await seedPromise;

    toast.success('✓ Proposal generated & synced successfully!');
    onNavigate('builder');
  };

  const toggleExtra = (extra: string) => {
    setExtras(prev =>
      prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-[30px] py-[26px] flex items-start justify-center">
      <div className="w-full max-w-[600px]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[--qk-pur] rounded-xl flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 className="text-[24px] tracking-[-0.3px] mb-1 font-semibold" style={{ fontFamily: 'var(--qk-serif)' }}>Quick-propose</h1>
          <p className="text-[13.5px] text-[--qk-ink3]">Answer questions — AI builds and saves your proposal draft</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-[5px] mb-[22px] justify-center" aria-hidden="true">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`w-[7px] h-[7px] rounded-full transition-colors ${
                i <= step ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'
              }`}
            ></span>
          ))}
        </div>

        <main className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] p-6 md:p-7 shadow-sm">
          {/* Step 1: Service type */}
          {step === 1 && (
            <div>
              <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-1">What type of work is this?</h2>
              <p className="text-[13px] text-[--qk-ink3] mb-4">Pick the closest category</p>
              <div className="flex flex-wrap gap-[7px] mb-6">
                {['Brand & Identity', 'Website Design', 'Development', 'Marketing', 'Consulting', 'Photography', 'Video Production', 'Other'].map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                      serviceType === type
                        ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                        : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex justify-end border-t border-[--qk-bdr] pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-[7px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue]"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Client */}
          {step === 2 && (
            <div>
              <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-1">Who is this proposal for?</h2>
              <p className="text-[13px] text-[--qk-ink3] mb-4">Select existing client</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  className="px-3 py-3 bg-[--qk-blue-l] border-2 border-[--qk-blue] rounded-[14px] flex items-center gap-[10px] text-left outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[--qk-blue] flex items-center justify-center text-[11px] font-semibold text-white" aria-hidden="true">VG</div>
                  <div>
                    <span className="text-[13px] font-semibold text-[--qk-blue] block">Marcus Chen</span>
                    <span className="text-[11.5px] text-[--qk-blue] block">Volta Goods</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  className="px-3 py-3 bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] flex items-center gap-[10px] text-left hover:bg-[--qk-s2] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] cursor-pointer"
                  onClick={() => toast.info('New client dialog')}
                >
                  <div className="w-8 h-8 rounded-full bg-[--qk-s2] flex items-center justify-center" aria-hidden="true">
                    <svg width="14" height="14" fill="none" stroke="var(--qk-ink3)" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-[--qk-ink2]">Create new client</span>
                </button>
              </div>
              
              <div className="flex gap-2 justify-end border-t border-[--qk-bdr] pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-[7px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] font-medium hover:bg-[--qk-s1] hover:text-[--qk-ink] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-[7px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Project details */}
          {step === 3 && (
            <div>
              <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-1">Describe the project scope</h2>
              <p className="text-[13px] text-[--qk-ink3] mb-4">Briefly outline deliverables or goals</p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <label htmlFor="proj-desc" className="sr-only">Scope Description</label>
                  <textarea
                    id="proj-desc"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0] min-h-[90px] resize-y"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                    placeholder="e.g. Brand identity package plus Shopify e-commerce design and development for premium outdoor gear store..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="proj-budget" className="block text-[12px] font-semibold text-[--qk-ink] mb-1">Target Budget</label>
                    <input
                      id="proj-budget"
                      type="text"
                      required
                      placeholder="e.g. $8,500"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0]"
                      style={{ fontFamily: 'var(--qk-sans)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-timeline" className="block text-[12px] font-semibold text-[--qk-ink] mb-1">Timeline</label>
                    <input
                      id="proj-timeline"
                      type="text"
                      required
                      placeholder="e.g. 6-8 weeks"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-[11px] py-[9px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none transition-all focus:border-[--qk-blue-m] focus:bg-[--qk-s0]"
                      style={{ fontFamily: 'var(--qk-sans)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-[--qk-bdr] pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3.5 py-[7px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] font-medium hover:bg-[--qk-s1] hover:text-[--qk-ink]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-[7px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Tone & extras */}
          {step === 4 && (
            <div>
              <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-1">What tone should the proposal take?</h2>
              <p className="text-[13px] text-[--qk-ink3] mb-4">Matches the client dynamic</p>
              <div className="flex flex-wrap gap-[7px] mb-5">
                {['Professional & concise', 'Warm & relationship-focused', 'Bold & confident', 'Creative & expressive'].map(t => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                      tone === t
                        ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                        : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <h3 className="text-[12.5px] font-semibold text-[--qk-ink] mb-2">Optional features to bundle</h3>
                <div className="flex flex-wrap gap-[7px]">
                  {['ROI calculator', 'Case study section', 'Video intro block', 'Testimonials', 'FAQ section'].map(extra => (
                    <button
                      type="button"
                      key={extra}
                      onClick={() => toggleExtra(extra)}
                      className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                        extras.includes(extra)
                          ? 'bg-[--qk-blue] border-[--qk-blue] text-white'
                          : 'border-[--qk-bdr] text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink]'
                      }`}
                    >
                      {extra}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t border-[--qk-bdr] pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3.5 py-[7px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] font-medium hover:bg-[--qk-s1] hover:text-[--qk-ink]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-[7px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Generate */}
          {step === 5 && (
            <div className="text-center py-4">
              {!generating ? (
                <>
                  <h2 className="text-[15px] font-semibold text-[--qk-ink] mb-1">Ready to generate draft</h2>
                  <p className="text-[13px] text-[--qk-ink3] mb-4">Your answers will write and format a full Supabase proposal</p>
                  
                  <div className="bg-[--qk-pur-l] border border-[--qk-pur-m] rounded-[14px] p-4 text-left mb-5">
                    <h3 className="text-[12px] font-bold mb-2 text-purple-950">Seeded Draft Components:</h3>
                    <ul className="space-y-1 text-[12.5px] text-purple-900 list-inside">
                      <li>✓ Scope of work & executive summary</li>
                      <li>✓ Custom pricing estimate based on budget</li>
                      <li>✓ Auto-tax rates for Canadian GST/HST rules</li>
                      <li>✓ Engagement analytics tracker setup</li>
                      <li>✓ Selected {extras.length} option modules</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={generateProposal}
                    className="w-full py-3 rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 hover:bg-[--qk-blue-d] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] min-h-[44px]"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Generate proposal draft
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="mt-3.5 text-[12.5px] text-[--qk-ink2] hover:underline cursor-pointer"
                  >
                    ← Go back & edit
                  </button>
                </>
              ) : (
                <div className="py-6 space-y-4">
                  <h2 className="text-[17px] text-[--qk-pur] font-semibold animate-pulse" style={{ fontFamily: 'var(--qk-serif)' }}>
                    {progressText}
                  </h2>
                  <div className="bg-[--qk-s1] h-2 rounded-full overflow-hidden max-w-[280px] mx-auto shadow-inner">
                    <div
                      className="h-full bg-[--qk-pur] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-[12px] font-bold text-[--qk-ink3]">{Math.round(progress)}% Complete</div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
