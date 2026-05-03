import { toast } from 'sonner';

export default function Portal() {
  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px] flex items-start justify-center">
      <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] max-w-[680px] w-full shadow-xl overflow-hidden">
        {/* Portal Header */}
        <div className="bg-[--qk-ink] px-[34px] py-[26px] flex justify-between items-center">
          <div className="text-[18px] text-white" style={{ fontFamily: 'var(--qk-serif)' }}>Sofia Adeyemi Studio</div>
          <div className="text-[11px] flex items-center gap-[5px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div className="w-[5px] h-[5px] rounded-full bg-[--qk-grn]"></div>
            Proposal #QK-0041
          </div>
        </div>

        {/* Portal Content */}
        <div className="px-[34px] py-[26px]">
          <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
            <div className="text-[9.5px] font-medium tracking-[1px] uppercase text-[--qk-ink3] mb-[9px]">Summary</div>
            <div className="text-[13.5px] text-[--qk-ink2] leading-[1.75]">
              Complete brand identity and Shopify storefront for Volta Goods. Covers discovery, strategy, design, development, and 2-week post-launch support.
            </div>
          </div>

          <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
            <div className="text-[9.5px] font-medium tracking-[1px] uppercase text-[--qk-ink3] mb-[9px]">Investment</div>
            <div className="grid grid-cols-3 gap-[7px] mb-3">
              {[
                { label: 'Starter', price: '$3,800', desc: 'Brand only' },
                { label: '★ Recommended', price: '$9,850', desc: 'Brand + Web', recommended: true },
                { label: 'Growth', price: '$10,500', desc: 'Brand + Web + SEO' },
              ].map((pkg, i) => (
                <div
                  key={i}
                  className={`border rounded-[10px] px-[11px] py-[11px] cursor-pointer transition-all ${
                    pkg.recommended
                      ? 'border-2 border-[--qk-blue] bg-[--qk-blue-l]'
                      : 'border-[--qk-bdr] hover:border-[--qk-blue-m]'
                  }`}
                  onClick={() => toast.success(`Selected ${pkg.label}`)}
                >
                  <div className={`text-[10px] mb-[2px] ${pkg.recommended ? 'text-[--qk-blue] font-medium' : 'text-[--qk-ink3]'}`}>{pkg.label}</div>
                  <div className={`text-[15px] font-medium ${pkg.recommended ? 'text-[--qk-blue]' : ''}`} style={{ fontFamily: 'var(--qk-mono)' }}>{pkg.price}</div>
                  <div className="text-[11px] text-[--qk-ink3] mt-[3px]">{pkg.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
            <div className="text-[9.5px] font-medium tracking-[1px] uppercase text-[--qk-ink3] mb-[9px]">Signature</div>
            <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] h-[72px] flex items-center justify-center cursor-pointer italic text-[18px] text-[--qk-ink3] hover:border-[--qk-blue-m] hover:bg-[--qk-blue-l] transition-all" style={{ fontFamily: 'var(--qk-serif)' }} onClick={() => toast.info('Signature pad')}>
              Click to sign
            </div>
            <div className="text-[11px] text-[--qk-ink3] mt-2">By signing, you agree to the terms outlined in this proposal</div>
          </div>

          <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
            <div className="text-[9.5px] font-medium tracking-[1px] uppercase text-[--qk-ink3] mb-[9px]">Payment method</div>
            <div className="flex gap-[7px] flex-wrap">
              {['💳 Card', '🏦 Bank', '⚡ Stripe', '📱 PayPal'].map((method, i) => (
                <div
                  key={i}
                  className={`flex-1 min-w-[90px] px-[9px] py-[9px] border rounded-[10px] text-center cursor-pointer text-[12px] transition-all ${
                    i === 0
                      ? 'border-[--qk-blue] bg-[--qk-blue-l] text-[--qk-blue]'
                      : 'border-[--qk-bdr] hover:border-[--qk-blue-m]'
                  }`}
                  onClick={() => toast.success(`Selected ${method}`)}
                >
                  <div className="text-[16px] mb-[3px]">{method.split(' ')[0]}</div>
                  {method.split(' ')[1]}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="w-full px-[11px] py-[11px] bg-[--qk-grn] text-white border-none rounded-[14px] text-[14px] font-medium cursor-pointer flex items-center justify-center gap-[7px] hover:bg-[#15803d] transition-colors" style={{ fontFamily: 'var(--qk-sans)' }} onClick={() => toast.success('✓ Proposal accepted!')}>
            <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Accept proposal & pay deposit
          </button>
          <div className="flex gap-[7px] mt-[7px]">
            <button className="flex-1 px-[9px] py-[9px] bg-transparent text-[--qk-ink2] border border-[--qk-bdr] rounded-[14px] text-[13px] cursor-pointer hover:bg-[--qk-s1] transition-colors" style={{ fontFamily: 'var(--qk-sans)' }} onClick={() => toast.info('Downloaded PDF')}>
              Download PDF
            </button>
            <button className="flex-1 px-[9px] py-[9px] bg-transparent text-[--qk-ink2] border border-[--qk-bdr] rounded-[14px] text-[13px] cursor-pointer hover:bg-[--qk-s1] transition-colors" style={{ fontFamily: 'var(--qk-sans)' }} onClick={() => toast.info('Schedule call')}>
              Schedule call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
