import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as Switch from '@radix-ui/react-switch';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('profile');

  // Profile fields state
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('CA');
  const [province, setProvince] = useState('');
  const [timezone, setTimezone] = useState('America/Toronto');
  const [saving, setSaving] = useState(false);

  // Preference switches state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSaveProposals, setAutoSaveProposals] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Notification switches state
  const [notifyOpened, setNotifyOpened] = useState(true);
  const [notifyAccepted, setNotifyAccepted] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);
  const [notifyMessage, setNotifyMessage] = useState(true);
  const [notifySummary, setNotifySummary] = useState(false);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Sync state from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setCompanyName(profile.company_name || '');
      setCountry(profile.country || 'CA');
      setProvince(profile.province || '');
      setTimezone(profile.timezone || 'America/Toronto');
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]" role="status" aria-label="Loading settings">
        <div className="w-6 h-6 border-2 border-[--qk-blue] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName.trim(),
          company_name: companyName.trim() || null,
          country,
          province: country === 'CA' ? (province || null) : null,
          timezone,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success(t('profile_updated_success'));
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err.message || t('profile_update_failed'));
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'profile', label: t('profile') },
    { id: 'branding', label: t('branding') },
    { id: 'integrations', label: t('integrations') },
    { id: 'billing', label: t('billing') },
    { id: 'notifications', label: t('notifications') },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-[30px] py-[26px]">
      <h1 className="text-[23px] tracking-[-0.4px] mb-5 text-[--qk-ink]" style={{ fontFamily: 'var(--qk-serif)' }}>{t('settings')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr] gap-[22px] items-start">
        {/* Sidebar Navigation */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" aria-label="Settings navigation">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-[10px] py-[7px] rounded-[10px] text-[13px] text-left cursor-pointer transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                activeSection === section.id
                  ? 'bg-[--qk-blue-l] text-[--qk-blue] font-medium'
                  : 'text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Settings Panel */}
        <main className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[14px] px-4 md:px-[22px] py-5">
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('profile_info')}</h2>
                
                <div className="mb-[14px]">
                  <label htmlFor="full-name" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('full_name')}</label>
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full max-w-[320px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                  />
                </div>

                <div className="mb-[14px]">
                  <label htmlFor="email" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('email_address')}</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled
                    value={profile?.email || user?.email || ''}
                    className="w-full max-w-[320px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink3] bg-[--qk-s1] cursor-not-allowed outline-none"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                  />
                </div>

                <div className="mb-[14px]">
                  <label htmlFor="company-name" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('company_name')}</label>
                  <input
                    id="company-name"
                    type="text"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full max-w-[320px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all"
                    style={{ fontFamily: 'var(--qk-sans)' }}
                  />
                </div>

                <div className="mb-[14px] grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[480px]">
                  <div>
                    <label htmlFor="country" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('country')}</label>
                    <select
                      id="country"
                      autoComplete="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all"
                    >
                      <option value="CA">Canada</option>
                      <option value="KE">Kenya</option>
                      <option value="TZ">Tanzania</option>
                      <option value="UG">Uganda</option>
                      <option value="RW">Rwanda</option>
                      <option value="US">United States</option>
                    </select>
                  </div>

                  {country === 'CA' && (
                    <div>
                      <label htmlFor="province" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('province_territory')}</label>
                      <select
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all"
                      >
                        <option value="">{t('select_province')}</option>
                        <option value="AB">Alberta (5% GST)</option>
                        <option value="BC">British Columbia (5% GST + 7% PST)</option>
                        <option value="MB">Manitoba (5% GST + 7% RST)</option>
                        <option value="NB">New Brunswick (15% HST)</option>
                        <option value="NL">Newfoundland & Labrador (15% HST)</option>
                        <option value="NS">Nova Scotia (15% HST)</option>
                        <option value="ON">Ontario (13% HST)</option>
                        <option value="PE">Prince Edward Island (15% HST)</option>
                        <option value="QC">Quebec (5% GST + 9.975% QST)</option>
                        <option value="SK">Saskatchewan (5% GST + 6% PST)</option>
                        <option value="NT">Northwest Territories (5% GST)</option>
                        <option value="NU">Nunavut (5% GST)</option>
                        <option value="YT">Yukon (5% GST)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-[14px]">
                  <label htmlFor="timezone" className="block text-[13px] font-medium text-[--qk-ink] mb-[6px]">{t('timezone')}</label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full max-w-[320px] px-[9px] py-[6px] border border-[--qk-bdr] rounded-[10px] text-[13px] text-[--qk-ink] bg-[--qk-s1] outline-none focus:border-[--qk-blue-m] focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all"
                  >
                    <option value="America/Toronto">America/Toronto (EST/EDT)</option>
                    <option value="America/Vancouver">America/Vancouver (PST/PDT)</option>
                    <option value="America/Edmonton">America/Edmonton (MST/MDT)</option>
                    <option value="America/Winnipeg">America/Winnipeg (CST/CDT)</option>
                    <option value="America/Halifax">America/Halifax (AST/ADT)</option>
                    <option value="America/St_Johns">America/St_Johns (NST/NDT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="UTC">UTC / GMT</option>
                  </select>
                </div>
              </div>

              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('preferences')}</h2>
                <SettingRow
                  id="email-notif"
                  label={t('email_notifs')}
                  sublabel={t('email_notifs_desc')}
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
                <SettingRow
                  id="auto-save"
                  label={t('auto_save')}
                  sublabel={t('auto_save_desc')}
                  checked={autoSaveProposals}
                  onCheckedChange={setAutoSaveProposals}
                />
                <SettingRow
                  id="show-tips"
                  label={t('show_tips')}
                  sublabel={t('show_tips_desc')}
                  checked={showOnboarding}
                  onCheckedChange={setShowOnboarding}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-medium hover:bg-[--qk-blue-d] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? t('saving') : t('save_changes')}
              </button>
            </form>
          )}

          {activeSection === 'branding' && (
            <>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('brand_colors')}</h2>
                <div className="flex flex-wrap gap-2">
                  {['#1d4ed8', '#16a34a', '#7c3aed', '#dc2626', '#b45309', '#0d9488'].map((color, i) => (
                    <button
                      key={i}
                      className="w-[28px] h-[28px] rounded-[5px] cursor-pointer border-2 border-transparent hover:border-[--qk-ink] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all"
                      style={{ background: color }}
                      onClick={() => toast.success(t('color_selected', { color }))}
                      aria-label={`Select brand color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('logo')}</h2>
                <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] hover:bg-[--qk-s1] hover:text-[--qk-ink] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer" onClick={() => toast.info(t('upload_logo'))}>
                  {t('upload_logo')}
                </button>
              </div>

              <button className="px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-medium hover:bg-[--qk-blue-d] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer" onClick={() => toast.success(t('branding_updated'))}>
                {t('save_branding')}
              </button>
            </>
          )}

          {activeSection === 'integrations' && (
            <>
              <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('connected_services')}</h2>
              {[
                { name: 'Stripe', desc: t('payment_processing'), connected: true },
                { name: 'Google Calendar', desc: t('schedule_sync'), connected: true },
                { name: 'Slack', desc: t('team_notifications'), connected: false },
                { name: 'Zapier', desc: t('workflow_automation'), connected: false },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between mb-3 pb-3 border-b border-[--qk-bdr] last:border-0 last:mb-0 last:pb-0">
                  <div>
                    <div className="text-[13.5px] font-medium text-[--qk-ink]">{service.name}</div>
                    <div className="text-[12px] text-[--qk-ink3]">{service.desc}</div>
                  </div>
                  <button
                    className={`px-3 py-[6px] rounded-[10px] text-[13px] font-medium cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                      service.connected
                        ? 'border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink]'
                        : 'border border-[--qk-blue] bg-[--qk-blue] text-white hover:bg-[--qk-blue-d]'
                    }`}
                    onClick={() => toast.success(service.connected ? t('service_disconnected', { service: service.name }) : t('service_connected', { service: service.name }))}
                  >
                    {service.connected ? t('disconnect') : t('connect')}
                  </button>
                </div>
              ))}
            </>
          )}

          {activeSection === 'billing' && (
            <>
              <div className="mb-[22px] pb-[22px] border-b border-[--qk-bdr]">
                <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('current_plan')}</h2>
                <div className="bg-[--qk-blue-l] border border-[--qk-blue-m] rounded-[14px] px-4 py-3 mb-3">
                  <div className="text-[15px] font-medium text-[--qk-blue] capitalize">{profile?.plan || 'Starter'} {t('plan')}</div>
                  <div className="text-[12px] text-[--qk-blue] mt-1">
                    {profile?.subscription_status === 'trialing' 
                      ? `${t('trialing_ends')} ${profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString() : t('soon')}`
                      : profile?.subscription_status === 'active' 
                      ? t('active_sub')
                      : t('free_usage')
                    }
                  </div>
                </div>
                {profile?.plan !== 'business' && (
                  <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] font-medium hover:bg-[--qk-s1] hover:text-[--qk-ink] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer" onClick={() => toast.info(t('upgrade_requests'))}>
                    {t('upgrade_plan')}
                  </button>
                )}
              </div>

              <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('payment_method')}</h2>
              <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[18px]" aria-hidden="true">💳</span>
                  <div>
                    <div className="text-[13px] font-medium text-[--qk-ink]">•••• •••• •••• 4242</div>
                    <div className="text-[12px] text-[--qk-ink3]">{t('expires')} 12/28</div>
                  </div>
                </div>
                <button className="px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] text-[13px] font-medium hover:bg-[--qk-s1] hover:text-[--qk-ink] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer" onClick={() => toast.info(t('card_update_form'))}>
                  {t('update')}
                </button>
              </div>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <h2 className="text-[14px] font-medium mb-[13px] text-[--qk-ink]">{t('email_alerts')}</h2>
              <div className="space-y-4">
                <SettingRow id="nt-opened" label={t('prop_opened')} sublabel={t('prop_opened_desc')} checked={notifyOpened} onCheckedChange={setNotifyOpened} />
                <SettingRow id="nt-accepted" label={t('prop_accepted')} sublabel={t('prop_accepted_desc')} checked={notifyAccepted} onCheckedChange={setNotifyAccepted} />
                <SettingRow id="nt-payment" label={t('payment_received')} sublabel={t('payment_received_desc')} checked={notifyPayment} onCheckedChange={setNotifyPayment} />
                <SettingRow id="nt-msg" label={t('new_msg')} sublabel={t('new_msg_desc')} checked={notifyMessage} onCheckedChange={setNotifyMessage} />
                <SettingRow id="nt-summary" label={t('weekly_summary')} sublabel={t('weekly_summary_desc')} checked={notifySummary} onCheckedChange={setNotifySummary} />
                <SettingRow id="nt-marketing" label={t('marketing_emails')} sublabel={t('marketing_emails_desc')} checked={notifyMarketing} onCheckedChange={setNotifyMarketing} />
              </div>

              <button className="mt-6 px-3 py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-medium hover:bg-[--qk-blue-d] focus-visible:ring-2 focus-visible:ring-[--qk-blue] outline-none transition-all cursor-pointer" onClick={() => toast.success(t('notif_prefs_saved'))}>
                {t('save_prefs')}
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

interface SettingRowProps {
  id: string;
  label: string;
  sublabel?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingRow({ id, label, sublabel, checked, onCheckedChange }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-[11px] border-b border-[--qk-bdr] last:border-0 last:pb-0">
      <div className="flex-1 pr-4">
        <label htmlFor={id} className="text-[13.5px] text-[--qk-ink] font-medium cursor-pointer">
          {label}
        </label>
        {sublabel && <div className="text-[12px] text-[--qk-ink3] mt-[1px]">{sublabel}</div>}
      </div>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={`w-[31px] h-[17px] rounded-[9px] relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] cursor-pointer flex-shrink-0 ${
          checked ? 'bg-[--qk-blue]' : 'bg-[--qk-s2]'
        }`}
      >
        <Switch.Thumb
          className={`block w-[13px] h-[13px] bg-white rounded-full transition-transform duration-100 will-change-transform ${
            checked ? 'translate-x-[16px] rtl:translate-x-[-16px]' : 'translate-x-[2px]'
          }`}
        />
      </Switch.Root>
    </div>
  );
}
