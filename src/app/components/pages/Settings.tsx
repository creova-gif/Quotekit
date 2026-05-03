import { useState } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile' },
    { id: 'branding', label: 'Branding' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'billing', label: 'Billing' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-[30px] py-[26px]">
      <div className="text-[23px] tracking-[-0.4px] mb-5" style={{ fontFamily: 'var(--qk-serif)' }}>Settings</div>

      <div className="grid grid-cols-[210px_1fr] gap-[22px]">
        {/* Sidebar Navigation */}
        <div>
          {sections.map(section => (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-[10px] py-[7px] rounded-[10px] text-[13px] cursor-pointer transition-all ${
                activeSection === section.id
                  ? 'bg-[--qk-blue-l] text-[--qk-blue] font-medium'
                  : 'text-[--qk-ink2] hover:bg-[--qk-s1]'
              }`}
            >
              {section.label}
            </div>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] px-[22px] py-5">
          {activeSection === 'profile' && (
            <>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <div className="text-[14px] font-medium mb-[13px]">Profile information</div>
                <div className="mb-[11px]">
                  <div className="text-[13.5px] text-[--qk-ink] mb-1">Full name</div>
                  <input className="w-[210px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] transition-all" style={{ fontFamily: 'var(--qk-sans)' }} defaultValue="Sofia Adeyemi" />
                </div>
                <div className="mb-[11px]">
                  <div className="text-[13.5px] text-[--qk-ink] mb-1">Email</div>
                  <input className="w-[210px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] transition-all" style={{ fontFamily: 'var(--qk-sans)' }} defaultValue="sofia@studiosa.co" />
                </div>
                <div className="mb-[11px]">
                  <div className="text-[13.5px] text-[--qk-ink] mb-1">Company name</div>
                  <input className="w-[210px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] transition-all" style={{ fontFamily: 'var(--qk-sans)' }} defaultValue="Sofia Adeyemi Studio" />
                </div>
              </div>

              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <div className="text-[14px] font-medium mb-[13px]">Preferences</div>
                <SettingRow label="Email notifications" sublabel="Receive email updates for activity" on />
                <SettingRow label="Auto-save proposals" sublabel="Save drafts automatically" on />
                <SettingRow label="Show onboarding tips" sublabel="Display helpful tooltips" />
              </div>

              <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('Profile updated')}>
                Save changes
              </button>
            </>
          )}

          {activeSection === 'branding' && (
            <>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <div className="text-[14px] font-medium mb-[13px]">Brand colors</div>
                <div className="flex gap-2">
                  {['#1d4ed8', '#16a34a', '#7c3aed', '#dc2626', '#b45309', '#0d9488'].map((color, i) => (
                    <div
                      key={i}
                      className="w-[26px] h-[26px] rounded-[5px] cursor-pointer border-2 border-transparent hover:border-[--qk-ink] transition-all"
                      style={{ background: color }}
                      onClick={() => toast.success(`Color ${color} selected`)}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <div className="text-[14px] font-medium mb-[13px]">Logo</div>
                <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Upload logo')}>
                  Upload logo
                </button>
              </div>

              <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('Branding updated')}>
                Save changes
              </button>
            </>
          )}

          {activeSection === 'integrations' && (
            <>
              <div className="text-[14px] font-medium mb-[13px]">Connected services</div>
              {[
                { name: 'Stripe', desc: 'Payment processing', connected: true },
                { name: 'Google Calendar', desc: 'Schedule sync', connected: true },
                { name: 'Slack', desc: 'Team notifications', connected: false },
                { name: 'Zapier', desc: 'Workflow automation', connected: false },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between mb-3 pb-3 border-b border-[--qk-bdr] last:border-0">
                  <div>
                    <div className="text-[13.5px] font-medium">{service.name}</div>
                    <div className="text-[12px] text-[--qk-ink3]">{service.desc}</div>
                  </div>
                  <button
                    className={`px-3 py-[6px] rounded-[10px] text-[13px] transition-all ${
                      service.connected
                        ? 'border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1]'
                        : 'border border-[--qk-blue] bg-[--qk-blue] text-white hover:bg-[--qk-blue-d]'
                    }`}
                    onClick={() => toast.success(service.connected ? `${service.name} disconnected` : `${service.name} connected`)}
                  >
                    {service.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </>
          )}

          {activeSection === 'billing' && (
            <>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <div className="text-[14px] font-medium mb-[13px]">Current plan</div>
                <div className="bg-[--qk-blue-l] border border-[--qk-blue-m] rounded-[14px] px-4 py-3">
                  <div className="text-[15px] font-medium text-[--qk-blue]">Pro Plan</div>
                  <div className="text-[12px] text-[--qk-blue] mt-1">$49/month · Renews May 15, 2026</div>
                </div>
                <button className="mt-3 px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Upgrade to Business')}>
                  Upgrade to Business
                </button>
              </div>

              <div className="text-[14px] font-medium mb-[13px]">Payment method</div>
              <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>💳</div>
                  <div>
                    <div className="text-[13px] font-medium">•••• •••• •••• 4242</div>
                    <div className="text-[12px] text-[--qk-ink3]">Expires 12/28</div>
                  </div>
                </div>
                <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] transition-all" onClick={() => toast.info('Update payment method')}>
                  Update
                </button>
              </div>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <div className="text-[14px] font-medium mb-[13px]">Email notifications</div>
              <SettingRow label="Proposal opened" sublabel="When a client opens your proposal" on />
              <SettingRow label="Proposal accepted" sublabel="When a client accepts your proposal" on />
              <SettingRow label="Payment received" sublabel="When you receive a payment" on />
              <SettingRow label="New message" sublabel="When a client sends you a message" on />
              <SettingRow label="Weekly summary" sublabel="Weekly activity report" />
              <SettingRow label="Marketing emails" sublabel="Product updates and tips" />

              <button className="mt-4 px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] hover:bg-[--qk-blue-d] transition-all" onClick={() => toast.success('Notification settings updated')}>
                Save changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, sublabel, on = false }: { label: string; sublabel?: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-[11px] last:mb-0">
      <div className="flex-1">
        <div className="text-[13.5px] text-[--qk-ink]">{label}</div>
        {sublabel && <div className="text-[12px] text-[--qk-ink3] mt-[1px]">{sublabel}</div>}
      </div>
      <div className={`w-[31px] h-[17px] rounded-[9px] cursor-pointer relative transition-all flex-shrink-0 ${on ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'}`}>
        <div className={`absolute w-[13px] h-[13px] bg-white rounded-full top-[2px] transition-all shadow-sm ${on ? 'left-[16px]' : 'left-[2px]'}`}></div>
      </div>
    </div>
  );
}
