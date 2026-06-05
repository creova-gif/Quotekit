export default function Landing({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="min-h-screen bg-[#f5f3ee]" style={{ fontFamily: 'var(--qk-sans)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-[18px] flex items-center gap-0 border-b" style={{ background: 'rgba(245,243,238,0.88)', backdropFilter: 'blur(14px)', borderColor: 'rgba(0,0,0,0.09)' }}>
        <div className="flex items-center gap-[10px] text-decoration-none flex-shrink-0">
          <div className="w-[30px] h-[30px] bg-[#0d0d0d] rounded-lg flex items-center justify-center">
            <svg width="15" height="15" fill="#f5f3ee" viewBox="0 0 16 16">
              <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z"/>
            </svg>
          </div>
          <span className="text-[17px] font-bold text-[#0d0d0d] tracking-[-0.3px]" style={{ fontFamily: 'var(--qk-serif)' }}>QuoteKit</span>
        </div>
        <div className="flex items-center gap-[2px] ml-10">
          {['Features', 'Pricing', 'Customers', 'Docs'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="px-[13px] py-[6px] rounded-md text-[14px] text-[#3d3d3d] no-underline hover:bg-white hover:text-[#0d0d0d] transition-all">
              {link}
            </a>
          ))}
        </div>
        <div className="ml-auto flex gap-[10px] items-center">
          <button className="px-[18px] py-2 border-[1.5px] rounded-lg text-[14px] text-[#3d3d3d] bg-transparent hover:bg-white hover:text-[#0d0d0d] transition-all" style={{ borderColor: 'rgba(0,0,0,0.16)', fontFamily: 'var(--qk-sans)' }}>
            Sign in
          </button>
          <button
            onClick={onEnterApp}
            className="px-5 py-2 bg-[#0d0d0d] rounded-lg text-[14px] text-[#f5f3ee] font-medium hover:bg-[#3d3d3d] transition-all"
            style={{ fontFamily: 'var(--qk-sans)' }}
          >
            Start free trial
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="min-h-screen px-12 pt-[130px] pb-20 flex flex-col items-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-white border rounded-full px-[14px] py-[5px] text-[13px] text-[#3d3d3d] mb-7" style={{ borderColor: 'rgba(0,0,0,0.16)' }}>
          <div className="w-[7px] h-[7px] rounded-full bg-[#15a34a] animate-pulse"></div>
          Now powered by Claude AI + RAG
        </div>

        <h1 className="text-[clamp(48px,6.5vw,88px)] font-extrabold leading-[1.0] tracking-[-3px] text-center max-w-[820px] mb-6" style={{ fontFamily: 'var(--qk-serif)' }}>
          Close deals <em className="not-italic text-[#e85d26] relative">faster</em> with AI-powered proposals
        </h1>

        <p className="text-lg text-[#3d3d3d] text-center max-w-[520px] mb-9 leading-[1.65]">
          QuoteKit uses AI to draft proposals, price projects, and track client engagement — so you can focus on winning work.
        </p>

        <div className="flex gap-3 items-center mb-5">
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-7 py-[14px] bg-[#0d0d0d] text-[#f5f3ee] rounded-[10px] text-[15px] font-semibold tracking-[-0.2px] hover:bg-[#e85d26] transition-all"
            style={{ fontFamily: 'var(--qk-serif)' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Start free trial
          </button>
          <button className="inline-flex items-center gap-[7px] px-6 py-[14px] border-[1.5px] rounded-[10px] text-[15px] text-[#3d3d3d] hover:bg-white hover:text-[#0d0d0d] transition-all" style={{ borderColor: 'rgba(0,0,0,0.16)', fontFamily: 'var(--qk-sans)' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Watch demo
          </button>
        </div>

        <p className="text-[13px] text-[#8a8a8a]">No credit card required · 14-day trial · Cancel anytime</p>

        {/* Product Screenshot */}
        <div className="w-full max-w-[1100px] mt-12 relative">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-2xl" style={{ borderColor: 'rgba(0,0,0,0.16)', boxShadow: '0 40px 80px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)' }}>
            <div className="bg-[#f0ede6] px-4 py-[11px] flex items-center gap-[7px] border-b" style={{ borderColor: 'rgba(0,0,0,0.09)' }}>
              <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56]"></div>
              <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e]"></div>
              <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f]"></div>
              <div className="flex-1 bg-white border rounded-[5px] px-3 py-1 text-[12px] text-[#8a8a8a] mx-5" style={{ borderColor: 'rgba(0,0,0,0.09)', fontFamily: 'var(--qk-mono)' }}>
                app.quotekit.co/proposals/volta-goods
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr_260px] h-[480px] overflow-hidden">
              {/* Sidebar */}
              <div className="bg-[#18181b] px-4 pt-4 flex flex-col">
                <div className="pb-[14px] text-[14px] font-bold text-white flex items-center gap-2 border-b mb-2" style={{ fontFamily: 'var(--qk-serif)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="w-[22px] h-[22px] bg-[#e85d26] rounded-[5px] flex items-center justify-center">
                    <svg width="11" height="11" fill="#fff" viewBox="0 0 16 16">
                      <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z"/>
                    </svg>
                  </div>
                  QuoteKit
                </div>
                {['Dashboard', 'Nexus AI', 'Proposals', 'Clients', 'Projects'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 px-4 py-[7px] text-[11.5px] text-white/50 ${i === 2 ? 'bg-white/10 text-white rounded-lg' : ''}`}>
                    <svg className="w-[13px] h-[13px] opacity-60" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="overflow-hidden">
                <div className="bg-white border-b px-5 py-[10px] flex items-center gap-[10px]" style={{ borderColor: '#eee' }}>
                  <div className="text-[12.5px] font-medium flex-1">Brand Identity & Website</div>
                  <div className="text-[10px] px-[7px] py-[2px] rounded-[10px] bg-[#fef3c7] text-[#92400e]">Draft</div>
                  <button className="px-[10px] py-[5px] rounded-[5px] text-[11px] border bg-[#1a47d4] text-white" style={{ borderColor: '#1a47d4' }}>Send</button>
                </div>
                <div className="h-[calc(100%-38px)] overflow-hidden bg-[#f5f3ee] p-4">
                  <div className="bg-white rounded-[10px] border h-full overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                    <div className="bg-[#18181b] px-7 py-5 flex justify-between items-center">
                      <div className="text-[13px] text-white font-semibold" style={{ fontFamily: 'var(--qk-serif)' }}>Sofia Adeyemi Studio</div>
                      <div className="text-[10px] text-white/45">#QK-0041</div>
                    </div>
                    <div className="px-7 py-[18px]">
                      <div className="text-[16px] font-bold text-[#18181b] mb-[3px] tracking-[-0.3px]" style={{ fontFamily: 'var(--qk-serif)' }}>Brand Identity & Website</div>
                      <div className="text-[11px] text-[#8a8a8a] mb-[14px]">Prepared for Volta Goods</div>
                      {[
                        { name: 'Brand identity design', val: '$3,800' },
                        { name: 'Shopify storefront', val: '$4,200' },
                        { name: 'Post-launch support', val: '$720' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between py-[6px] border-b text-[11.5px]" style={{ borderColor: '#f0ede6' }}>
                          <span className="text-[#3d3d3d] font-medium">{item.name}</span>
                          <span className="text-[#3d3d3d]" style={{ fontFamily: 'var(--qk-mono)' }}>{item.val}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 text-[13px] font-semibold mt-[6px] text-[#18181b]">
                        <span>Total</span>
                        <span className="text-[#1a47d4]" style={{ fontFamily: 'var(--qk-mono)' }}>$9,850</span>
                      </div>
                      <div className="mt-[10px] bg-[#ede9fe] border rounded-md px-[10px] py-2 text-[10.5px] text-[#4c1d95] flex gap-[6px] items-start" style={{ borderColor: '#ddd6fe' }}>
                        <span>💡</span>
                        <span>AI suggests adding ROI calculator (+34% acceptance)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="border-l bg-white flex flex-col" style={{ borderColor: '#eee' }}>
                <div className="px-[14px] py-[10px] border-b text-[11px] font-medium text-[#1a47d4]" style={{ borderColor: '#f4f4f5' }}>AI Insights</div>
                {[
                  { label: 'Win rate', text: '78% similar projects' },
                  { label: 'Pricing', text: 'Optimal for this client' },
                ].map((item, i) => (
                  <div key={i} className="px-[14px] py-[10px] border-b" style={{ borderColor: '#f4f4f5' }}>
                    <div className="text-[10px] font-medium tracking-[0.5px] uppercase text-[#a1a1aa] mb-[5px]">{item.label}</div>
                    <div className="text-[11px] text-[#3d3d3d] leading-[1.5]">{item.text}</div>
                  </div>
                ))}
                <div className="px-[14px] py-[10px]">
                  <div className="text-[10px] font-medium tracking-[0.5px] uppercase text-[#a1a1aa] mb-2">Activity</div>
                  {[
                    { text: 'Opened 4m ago', color: '#1a47d4' },
                    { text: 'Delivered', color: '#15a34a' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2 text-[11px] text-[#52525b]">
                      <div className="w-[6px] h-[6px] rounded-full mt-[3px]" style={{ background: item.color }}></div>
                      <div>{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#0d0d0d] px-12 py-6 flex items-center justify-center gap-0">
        {[
          { num: '10k+', desc: 'Proposals created' },
          { num: '$2.4M', desc: 'Revenue closed' },
          { num: '89%', desc: 'Average win rate' },
          { num: '3.2x', desc: 'Faster close time' },
        ].map((stat, i) => (
          <div key={i} className={`text-center flex-1 max-w-[200px] px-8 ${i < 3 ? 'border-r' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="text-[36px] font-extrabold text-white tracking-[-1.5px]" style={{ fontFamily: 'var(--qk-serif)' }}>
              {stat.num}
            </div>
            <div className="text-[13px] text-white/50 mt-[2px]">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Features Preview */}
      <div className="px-12 py-[88px]">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-[12px] font-semibold tracking-[1.5px] uppercase text-[#e85d26] mb-3">Features</div>
          <h2 className="text-[clamp(36px,4vw,54px)] font-extrabold tracking-[-2px] leading-[1.05] mb-4 text-[#0d0d0d]" style={{ fontFamily: 'var(--qk-serif)' }}>
            Everything you need to win
          </h2>
          <p className="text-[17px] text-[#3d3d3d] max-w-[540px] leading-[1.65] mb-14">
            From AI-powered drafting to real-time tracking, QuoteKit handles the entire proposal workflow.
          </p>

          <div className="grid grid-cols-3 gap-[2px] border rounded-2xl overflow-hidden bg-[rgba(0,0,0,0.09)]" style={{ borderColor: 'rgba(0,0,0,0.09)' }}>
            {[
              { title: 'AI Draft', desc: 'Generate complete proposals in 60 seconds', icon: '✨' },
              { title: 'Smart Pricing', desc: 'AI suggests optimal pricing based on win rates', icon: '💰' },
              { title: 'ROI Calculator', desc: 'Interactive sliders show value to clients', icon: '📊' },
              { title: 'Live Tracking', desc: 'See when clients open and engage', icon: '👁️' },
              { title: 'Auto Follow-up', desc: 'Scheduled reminders keep deals moving', icon: '📧' },
              { title: 'E-Signature', desc: 'Built-in signing and payment collection', icon: '✍️' },
            ].map((feat, i) => (
              <div key={i} className="bg-[#f5f3ee] px-8 py-8 hover:bg-white transition-colors">
                <div className="text-[28px] mb-[18px]">{feat.icon}</div>
                <div className="text-[19px] font-bold tracking-[-0.5px] mb-2 text-[#0d0d0d]" style={{ fontFamily: 'var(--qk-serif)' }}>{feat.title}</div>
                <div className="text-[14.5px] text-[#3d3d3d] leading-[1.65]">{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0d0d0d] px-12 py-20 text-center">
        <h2 className="text-[clamp(34px,3.5vw,50px)] font-extrabold tracking-[-2px] leading-[1.05] text-white mb-[18px]" style={{ fontFamily: 'var(--qk-serif)' }}>
          Ready to close more deals?
        </h2>
        <p className="text-base text-white/60 leading-[1.7] mb-8 max-w-[500px] mx-auto">
          Join thousands of agencies and freelancers using QuoteKit to win work faster.
        </p>
        <button
          onClick={onEnterApp}
          className="inline-flex items-center gap-2 px-7 py-[14px] bg-[#e85d26] text-white rounded-[10px] text-[15px] font-semibold tracking-[-0.2px] hover:bg-[#d44e1a] transition-all"
          style={{ fontFamily: 'var(--qk-serif)' }}
        >
          Start free trial
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
