import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { getTaxForProvince } from '../../../lib/tax';
import type { AppUser } from '../../../lib/types';

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string;
  currency: string;
  province?: string | null;
}

interface LineItem {
  id?: string;
  proposal_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

interface Proposal {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  status: string;
  currency: string;
  tax_rate: number;
  tax_label: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  valid_until: string | null;
  public_token: string;
  cover_title: string;
  cover_subtitle: string | null;
  signature_data: string | null;
  signed_at: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  due_date: string;
  paid_at: string | null;
  payment_method: string | null;
}

interface ProposalEvent {
  id: string;
  event_type: string;
  created_at: string;
  metadata: any;
}

export default function Builder({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('ai');
  const [loading, setLoading] = useState(true);

  // Proposal data states
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [events, setEvents] = useState<ProposalEvent[]>([]);

  // Editable values in proposal document
  const [coverTitle, setCoverTitle] = useState('Brand Identity & Website — Full Package');
  const [coverSubtitle, setCoverSubtitle] = useState('Prepared for Volta Goods · April 2026');
  const [revenue, setRevenue] = useState(20000);
  const [conversionLift, setConversionLift] = useState(15);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load or create active proposal
  useEffect(() => {
    if (!user) return;

    let active = true;

    async function loadData() {
      try {
        setLoading(true);

        // 1. Get the most recent proposal
        const { data: props, error: propsErr } = await supabase
          .from('proposals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (propsErr) throw propsErr;

        let activeProp: Proposal;

        if (!props || props.length === 0) {
          // No proposal found: Seed default client & proposal
          let clientData: Client;
          const { data: clients, error: clientsErr } = await supabase
            .from('clients')
            .select('*')
            .limit(1);

          if (clientsErr) throw clientsErr;

          if (!clients || clients.length === 0) {
            // Seed client
            const { data: newClient, error: newClientErr } = await supabase
              .from('clients')
              .insert({
                user_id: user.id,
                name: 'Marcus Chen',
                company: 'Volta Goods',
                email: 'm.chen@voltagoods.co',
                country: 'CA',
                currency: 'CAD',
                status: 'lead',
              })
              .select()
              .single();

            if (newClientErr) throw newClientErr;
            clientData = newClient as unknown as Client;
          } else {
            clientData = clients[0] as unknown as Client;
          }

          // Compute tax info for default proposal
          const taxInfo = getTaxForProvince(profile?.province ?? 'ON', profile?.country ?? 'CA');

          // Seed proposal
          const { data: newProp, error: newPropErr } = await supabase
            .from('proposals')
            .insert({
              user_id: user.id,
              client_id: clientData.id,
              title: 'Brand Identity & Website — Volta Goods',
              cover_title: 'Brand Identity & Website — Full Package',
              cover_subtitle: 'Prepared for Volta Goods · April 2026',
              status: 'draft',
              currency: profile?.currency ?? 'CAD',
              tax_rate: taxInfo.rate,
              tax_label: taxInfo.label,
              subtotal: 9850,
              tax_amount: 9850 * taxInfo.rate,
              total: 9850 * (1 + taxInfo.rate),
            })
            .select()
            .single();

          if (newPropErr) throw newPropErr;

          // Seed default line items
          const defaultItems = [
            { proposal_id: newProp.id, description: 'Brand Identity Design (Logo, brand system, and packaging guidelines)', quantity: 1, unit_price: 3400, sort_order: 1 },
            { proposal_id: newProp.id, description: 'UX/UI Design & Multi-page Webflow E-commerce Development', quantity: 1, unit_price: 6450, sort_order: 2 },
          ];

          const { error: itemsErr } = await supabase
            .from('line_items')
            .insert(defaultItems);

          if (itemsErr) throw itemsErr;

          activeProp = newProp as Proposal;
        } else {
          activeProp = props[0] as Proposal;
        }

        if (!active) return;
        setProposal(activeProp);
        setCoverTitle(activeProp.cover_title);
        setCoverSubtitle(activeProp.cover_subtitle || '');

        // 2. Fetch the client details
        const { data: clientData, error: clientErr } = await supabase
          .from('clients')
          .select('*')
          .eq('id', activeProp.client_id)
          .single();

        if (clientErr) throw clientErr;
        if (active) setClient(clientData as unknown as Client);

        // 3. Fetch line items
        const { data: itemsData, error: itemsErr } = await supabase
          .from('line_items')
          .select('*')
          .eq('proposal_id', activeProp.id)
          .order('sort_order', { ascending: true });

        if (itemsErr) throw itemsErr;
        if (active) setLineItems((itemsData || []) as LineItem[]);

        // 4. Fetch invoices
        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('*')
          .eq('proposal_id', activeProp.id);
        if (active) setInvoices((invoicesData || []) as unknown as Invoice[]);

        // 5. Fetch events
        const { data: eventsData } = await supabase
          .from('proposal_events')
          .select('*')
          .eq('proposal_id', activeProp.id)
          .order('created_at', { ascending: false });
        if (active) setEvents((eventsData || []) as ProposalEvent[]);

      } catch (err: any) {
        console.error('Error loading builder data:', err);
        toast.error('Failed to load proposal details');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [user, profile]);

  // Debounced auto-save hook
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!proposal) return;

    setSavingState('saving');
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Calculate subtotal from current line items
        const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
        const taxRate = proposal.tax_rate;
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;

        const { error } = await supabase
          .from('proposals')
          .update({
            cover_title: coverTitle.trim(),
            cover_subtitle: coverSubtitle.trim() || null,
            subtotal,
            tax_amount: taxAmount,
            total,
            updated_at: new Date().toISOString()
          })
          .eq('id', proposal.id);

        if (error) throw error;

        // Sync proposal local state totals
        setProposal(prev => prev ? {
          ...prev,
          cover_title: coverTitle.trim(),
          cover_subtitle: coverSubtitle.trim() || null,
          subtotal,
          tax_amount: taxAmount,
          total
        } : null);

        setSavingState('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSavingState('error');
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [coverTitle, coverSubtitle, lineItems]);

  // Pricing calculations
  const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const taxRate = proposal?.tax_rate ?? 0.13;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: proposal?.currency || 'CAD'
    });
  };

  const calculateROI = () => {
    const additionalRevenue = revenue * (conversionLift / 100);
    const annualIncrease = additionalRevenue * 12;
    const investment = subtotal || 9850;
    const roi = ((annualIncrease - investment) / investment) * 100;

    return {
      additional: formatCurrency(additionalRevenue),
      annual: formatCurrency(annualIncrease),
      roi: Math.round(roi) + '%'
    };
  };

  const roiData = calculateROI();

  // Signature triggers
  const handleSaveSignature = async (signatureDataUrl: string) => {
    if (!proposal) return;
    try {
      const nowStr = new Date().toISOString();
      const { error } = await supabase
        .from('proposals')
        .update({
          signature_data: signatureDataUrl,
          signed_at: nowStr,
          status: 'accepted'
        })
        .eq('id', proposal.id);

      if (error) throw error;

      setProposal(prev => prev ? {
        ...prev,
        signature_data: signatureDataUrl,
        signed_at: nowStr,
        status: 'accepted'
      } : null);

      // Create an audit event for signing
      await supabase.from('proposal_events').insert({
        proposal_id: proposal.id,
        event_type: 'signed',
        metadata: { source: 'builder-sign' }
      });

      // Reload events list
      const { data: updatedEvents } = await supabase
        .from('proposal_events')
        .select('*')
        .eq('proposal_id', proposal.id)
        .order('created_at', { ascending: false });
      setEvents(updatedEvents || []);

      toast.success('Proposal accepted and signed!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save signature');
    }
  };

  const handleClearSignature = async () => {
    if (!proposal) return;
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          signature_data: null,
          signed_at: null,
          status: 'draft'
        })
        .eq('id', proposal.id);

      if (error) throw error;

      setProposal(prev => prev ? {
        ...prev,
        signature_data: null,
        signed_at: null,
        status: 'draft'
      } : null);

      toast.success('Signature cleared.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear signature');
    }
  };

  // Invoice management
  const handleGenerateInvoice = async () => {
    if (!proposal || !user) return;
    try {
      const invNum = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: newInv, error } = await supabase
        .from('invoices')
        .insert({
          proposal_id: proposal.id,
          user_id: user.id,
          client_id: proposal.client_id,
          invoice_number: invNum,
          status: 'draft',
          currency: proposal.currency,
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => [newInv as unknown as Invoice, ...prev]);
      toast.success(`Generated Invoice ${invNum}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate invoice');
    }
  };

  const handleSetInvoicePaid = async (invId: string) => {
    try {
      const { data: updatedInv, error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: 'bank'
        })
        .eq('id', invId)
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => prev.map(inv => inv.id === invId ? (updatedInv as unknown as Invoice) : inv));
      toast.success('Invoice marked as paid!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update invoice');
    }
  };

  // Line item modifications
  const handleAddLineItem = async (description: string, quantity: number, unitPrice: number) => {
    if (!proposal) return;
    try {
      const newItem = {
        proposal_id: proposal.id,
        description,
        quantity,
        unit_price: unitPrice,
        sort_order: lineItems.length + 1
      };

      const { data: createdItem, error } = await supabase
        .from('line_items')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;

      setLineItems(prev => [...prev, createdItem as LineItem]);
      toast.success('Line item added');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add line item');
    }
  };

  const handleDeleteLineItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('line_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setLineItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Line item deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete line item');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]" role="status" aria-label="Loading builder">
        <div className="w-8 h-8 border-3 border-[--qk-blue] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[13px] text-[--qk-ink2] mt-3 font-medium">Opening proposal canvas...</p>
      </div>
    );
  }

  return (
    <>
      {/* Builder Topbar */}
      <header className="h-14 bg-[--qk-s0] border-b border-[--qk-bdr] px-4 flex items-center gap-[9px] flex-shrink-0 z-10 sticky top-0">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1 text-[--qk-ink2] hover:text-[--qk-ink] text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] rounded px-1 min-h-[44px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Proposals
        </button>
        <span className="text-[--qk-bdr2]" aria-hidden="true">/</span>
        <div className="text-[13.5px] font-semibold text-[--qk-ink] truncate max-w-[150px] sm:max-w-xs">{proposal?.title}</div>
        
        <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[11px] bg-[--qk-s1] text-[--qk-ink2] border border-[--qk-bdr] capitalize">
          {proposal?.status}
        </span>

        {/* Auto-save Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] ml-1">
          {savingState === 'saving' && (
            <span className="text-[--qk-ink3] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[--qk-ink3]"></span>
              Auto-saving...
            </span>
          )}
          {savingState === 'saved' && (
            <span className="text-[--qk-grn] flex items-center gap-1">
              <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Auto-saved
            </span>
          )}
          {savingState === 'error' && (
            <span className="text-[--qk-red] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[--qk-red]"></span>
              Save failed
            </span>
          )}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className="hidden md:flex px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all items-center gap-[5px] cursor-pointer font-medium min-h-[44px]"
            onClick={() => {
              toast.info('Preview mode active');
              setActiveTab('send');
            }}
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </button>
          
          <button
            type="button"
            className="px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-bdr] bg-transparent text-[--qk-ink2] hover:bg-[--qk-s1] hover:text-[--qk-ink] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all flex items-center gap-[5px] cursor-pointer font-medium min-h-[44px]"
            onClick={() => toast.success('PDF generated successfully for Volta Goods!')}
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </button>

          <button
            type="button"
            className="px-3 py-[6px] rounded-[10px] text-[13px] border border-[--qk-blue] bg-[--qk-blue] text-white hover:bg-[--qk-blue-d] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all flex items-center gap-[5px] cursor-pointer font-semibold min-h-[44px]"
            onClick={() => setActiveTab('send')}
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send
          </button>
        </div>
      </header>

      {/* Builder Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] overflow-y-auto lg:overflow-hidden min-h-0">
        {/* Left Side: Document Canvas */}
        <div className="overflow-y-auto bg-[--qk-bg] p-4 md:p-[22px] lg:h-full">
          <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] max-w-[720px] mx-auto shadow-sm overflow-hidden mb-6">
            {/* Header branding overlay */}
            <div className="px-6 md:px-[38px] pt-7 pb-6 bg-[--qk-ink] flex justify-between items-start text-white">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center bg-white/10" aria-hidden="true">
                  <svg className="w-5 h-5" stroke="#fff" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-medium tracking-tight" style={{ fontFamily: 'var(--qk-serif)' }}>
                    {profile?.company_name || 'My Studio'}
                  </div>
                  <div className="text-[11px] text-white/50 mt-[1px]">Brand · Design · Strategy</div>
                </div>
              </div>
              <div className="text-right text-[11px] leading-relaxed text-white/60">
                <div>Proposal <strong className="text-white font-semibold">#QK-{proposal?.id.slice(0,4).toUpperCase()}</strong></div>
                <div>{proposal ? new Date(proposal.valid_until || Date.now()).toLocaleDateString() : ''}</div>
                <div>Valid for: <strong className="text-white font-semibold">30 Days</strong></div>
              </div>
            </div>

            {/* Editable Title Section */}
            <DocSection>
              <SectionLabel>Cover title</SectionLabel>
              <input
                id="doc-cover-title"
                className="w-full text-2xl md:text-3xl font-semibold tracking-tight border-none outline-none bg-transparent text-[--qk-ink] mb-1 font-serif focus-visible:ring-2 focus-visible:ring-[--qk-blue] rounded"
                style={{ fontFamily: 'var(--qk-serif)' }}
                value={coverTitle}
                onChange={(e) => setCoverTitle(e.target.value)}
                placeholder="Brand Identity & Website — Full Package"
                aria-label="Cover title"
              />
              <input
                id="doc-cover-sub"
                className="w-full text-[13px] text-[--qk-ink2] border-none outline-none bg-transparent focus-visible:ring-2 focus-visible:ring-[--qk-blue] rounded"
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
                placeholder="Prepared for Client"
                aria-label="Cover subtitle"
              />
            </DocSection>

            {/* Client Section */}
            <DocSection>
              <SectionLabel>Prepared for</SectionLabel>
              <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] px-4 py-3 flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold bg-blue-100 text-blue-700 flex-shrink-0" aria-hidden="true">
                  {client?.name ? client.name.split(' ').map(n=>n[0]).join('') : 'CL'}
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-[--qk-ink]">{client?.name} — {client?.company}</div>
                  <div className="text-[12px] text-[--qk-ink2]">{client?.email}</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="text-[11px] text-[--qk-ink2] bg-[--qk-s0] border border-[--qk-bdr] rounded-full px-2.5 py-0.5">
                      {client?.country === 'CA' ? 'Canada' : client?.country}
                    </span>
                    <span className="text-[11px] text-[--qk-ink2] bg-[--qk-s0] border border-[--qk-bdr] rounded-full px-2.5 py-0.5">
                      {proposal?.currency}
                    </span>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* ROI Calculator */}
            <DocSection>
              <SectionLabel>ROI calculator</SectionLabel>
              <div className="border border-[--qk-bdr] rounded-[14px] bg-[--qk-grn-l] p-4">
                <div className="text-[13.5px] font-semibold text-[--qk-grn] mb-3 flex items-center gap-[7px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Projected return on investment
                </div>
                <div className="mb-3">
                  <div className="text-[12px] font-medium mb-1.5 flex justify-between text-green-900">
                    <label htmlFor="roi-revenue">Current monthly revenue</label>
                    <strong className="font-semibold">${revenue.toLocaleString()}</strong>
                  </div>
                  <input
                    id="roi-revenue"
                    type="range"
                    min="5000"
                    max="200000"
                    step="1000"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full accent-[--qk-grn] cursor-pointer h-2 bg-green-200 rounded-lg appearance-none outline-none focus-visible:ring-2 focus-visible:ring-[--qk-grn]"
                  />
                </div>
                <div className="mb-4">
                  <div className="text-[12px] font-medium mb-1.5 flex justify-between text-green-900">
                    <label htmlFor="roi-lift">Expected conversion lift</label>
                    <strong className="font-semibold">{conversionLift}%</strong>
                  </div>
                  <input
                    id="roi-lift"
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={conversionLift}
                    onChange={(e) => setConversionLift(Number(e.target.value))}
                    className="w-full accent-[--qk-grn] cursor-pointer h-2 bg-green-200 rounded-lg appearance-none outline-none focus-visible:ring-2 focus-visible:ring-[--qk-grn]"
                  />
                </div>
                <div className="bg-white border border-[--qk-grn-m] rounded-[10px] px-3.5 py-3 shadow-xs">
                  <ROIRow label="Additional monthly revenue" value={roiData.additional} />
                  <ROIRow label="Annual revenue increase" value={roiData.annual} />
                  <ROIRow label="Investment" value={formatCurrency(subtotal)} />
                  <div className="flex justify-between text-[14px] font-bold text-[--qk-grn] pt-2.5 mt-2 border-t border-[--qk-grn-m]">
                    <span>ROI at 12 months</span>
                    <strong style={{ fontFamily: 'var(--qk-mono)' }}>{roiData.roi}</strong>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Dynamic Proposal pricing breakdown */}
            <DocSection>
              <SectionLabel>Investment Details</SectionLabel>
              <div className="border border-[--qk-bdr] rounded-[14px] overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[--qk-s1] border-b border-[--qk-bdr] text-[--qk-ink2] font-semibold">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center w-12">Qty</th>
                      <th className="py-2.5 px-3 text-right w-28">Price</th>
                      <th className="py-2.5 px-3 text-right w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--qk-bdr]">
                    {lineItems.map((item, index) => (
                      <tr key={index} className="hover:bg-[--qk-bg] transition-colors">
                        <td className="py-3 px-3 text-[--qk-ink] font-medium">{item.description}</td>
                        <td className="py-3 px-3 text-center text-[--qk-ink2]">{Number(item.quantity)}</td>
                        <td className="py-3 px-3 text-right text-[--qk-ink2]">{formatCurrency(Number(item.unit_price))}</td>
                        <td className="py-3 px-3 text-right text-[--qk-ink] font-semibold">{formatCurrency(item.quantity * item.unit_price)}</td>
                      </tr>
                    ))}
                    {lineItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-[--qk-ink3] italic">No items defined in pricing grid.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="border-t border-[--qk-bdr] bg-[--qk-bg] p-4 flex justify-end">
                  <div className="w-64 space-y-1.5 text-[12.5px]">
                    <div className="flex justify-between text-[--qk-ink2]">
                      <span>Subtotal</span>
                      <strong className="font-semibold">{formatCurrency(subtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-[--qk-ink2]">
                      <span>{proposal?.tax_label || 'Tax'}</span>
                      <strong className="font-semibold">{formatCurrency(taxAmount)}</strong>
                    </div>
                    <div className="flex justify-between text-[14px] font-bold text-[--qk-ink] border-t border-[--qk-bdr] pt-2">
                      <span>Total Investment</span>
                      <strong style={{ fontFamily: 'var(--qk-mono)' }}>{formatCurrency(total)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Testimonials */}
            <DocSection>
              <SectionLabel>What clients say</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            {/* Signature Area (if signed) */}
            {proposal?.signature_data && (
              <DocSection>
                <SectionLabel>Agreement & Signatures</SectionLabel>
                <div className="border border-[--qk-bdr] rounded-[14px] bg-[--qk-s1] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-[13px] font-semibold text-[--qk-ink]">Accepted & Signed</h3>
                    <p className="text-[11.5px] text-[--qk-ink3] mt-0.5">Signed by client via secure link on {new Date(proposal.signed_at || '').toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white border border-[--qk-bdr] rounded-lg p-2 max-w-[200px]">
                    <img src={proposal.signature_data} alt="Client Signature" className="max-h-[60px]" />
                  </div>
                </div>
              </DocSection>
            )}
          </div>
        </div>

        {/* Right Side: Tab Panel (Radix UI Tabs) */}
        <aside className="border-t lg:border-t-0 lg:border-l border-[--qk-bdr] bg-[--qk-s0] flex flex-col lg:h-full lg:overflow-hidden min-h-[400px]">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
            <Tabs.List className="flex border-b border-[--qk-bdr] flex-shrink-0 overflow-x-auto bg-[--qk-s0] scrollbar-none" aria-label="Proposal tools">
              {['AI', 'Sign', 'Invoice', 'Pricing', 'Send', 'Track', 'Auto'].map(tab => (
                <Tabs.Trigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className={`flex-1 min-w-[56px] px-2 py-[10px] text-center text-[11.5px] font-semibold cursor-pointer border-b-2 transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                    activeTab === tab.toLowerCase()
                      ? 'text-[--qk-blue] border-[--qk-blue]'
                      : 'text-[--qk-ink3] border-transparent hover:text-[--qk-ink2]'
                  }`}
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
              <Tabs.Content value="ai" className="outline-none flex flex-col gap-3">
                <AIPanel onApplyAddon={(name, price) => handleAddLineItem(name, 1, price)} />
              </Tabs.Content>
              
              <Tabs.Content value="sign" className="outline-none flex flex-col gap-3">
                <SignPanel
                  signature={proposal?.signature_data}
                  onSign={handleSaveSignature}
                  onClear={handleClearSignature}
                />
              </Tabs.Content>

              <Tabs.Content value="invoice" className="outline-none flex flex-col gap-3">
                <InvoicePanel
                  proposal={proposal}
                  invoices={invoices}
                  onGenerate={handleGenerateInvoice}
                  onPay={handleSetInvoicePaid}
                />
              </Tabs.Content>

              <Tabs.Content value="pricing" className="outline-none flex flex-col gap-3">
                <PricingPanel
                  items={lineItems}
                  currency={proposal?.currency || 'CAD'}
                  onAdd={handleAddLineItem}
                  onDelete={handleDeleteLineItem}
                />
              </Tabs.Content>

              <Tabs.Content value="send" className="outline-none flex flex-col gap-3">
                <SendPanel
                  clientEmail={client?.email}
                  clientName={client?.name}
                  proposalTitle={proposal?.title}
                  proposalId={proposal?.id}
                />
              </Tabs.Content>

              <Tabs.Content value="track" className="outline-none flex flex-col gap-3">
                <TrackPanel events={events} />
              </Tabs.Content>

              <Tabs.Content value="auto" className="outline-none flex flex-col gap-3">
                <AutoPanel />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </aside>
      </div>
    </>
  );
}

// Helper components for the Document layout
function DocSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative group px-6 md:px-[38px] py-[22px] border-b border-[--qk-bdr] last:border-0 hover:bg-stone-50/50 transition-all">
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[9.5px] font-semibold tracking-wider uppercase text-[--qk-ink3] mb-2.5 flex items-center gap-[5px]">
      <div className="grid grid-cols-2 gap-[2px] w-2.5 cursor-grab" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="w-[2px] h-[2px] rounded-full bg-[--qk-ink4]"></span>
        ))}
      </div>
      {children}
    </h2>
  );
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] py-1 text-green-950">
      <span>{label}</span>
      <strong style={{ fontFamily: 'var(--qk-mono)' }} className="font-semibold">{value}</strong>
    </div>
  );
}

function Testimonial({ quote, name, company, avatar, color, textColor }: any) {
  return (
    <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[14px] px-3.5 py-3">
      <blockquote className="text-[13px] text-[--qk-ink2] leading-relaxed mb-2.5 italic font-serif">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-2">
        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: color, color: textColor }} aria-hidden="true">
          {avatar}
        </div>
        <div>
          <cite className="text-[12px] font-semibold text-[--qk-ink] not-italic block">{name}</cite>
          <div className="text-[11px] text-[--qk-ink3]">{company}</div>
        </div>
      </div>
    </div>
  );
}

// Side Panel Components
function AIPanel({ onApplyAddon }: { onApplyAddon: (name: string, price: number) => void }) {
  return (
    <>
      <div className="bg-[--qk-pur-l] border border-[--qk-pur-m] rounded-[14px] p-3">
        <div className="flex items-center gap-[6px] mb-3">
          <div className="w-[22px] h-[22px] bg-[--qk-pur] rounded-[5px] flex items-center justify-center" aria-hidden="true">
            <svg width="12" height="12" stroke="#fff" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </div>
          <h3 className="text-[12.5px] font-semibold text-purple-950">AI suggestions</h3>
          <div className="ml-auto text-[10px] text-[--qk-pur] bg-[--qk-pur-m] px-2 py-0.5 rounded-full font-medium">3 insights</div>
        </div>
        
        <button
          type="button"
          className="w-full text-left bg-white border border-[--qk-pur-m] rounded-[10px] px-2.5 py-2 text-[12px] leading-relaxed hover:bg-[--qk-pur-l] hover:border-purple-300 transition-all mb-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-pur] cursor-pointer"
          onClick={() => {
            onApplyAddon('Optional Custom Explainer Video Intro', 500);
            toast.success('Video intro add-on added!');
          }}
        >
          <div className="text-[10px] font-bold text-[--qk-pur] mb-[2px] flex items-center gap-[3px]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Conv. +34%
          </div>
          Add explainer video intro. Proposals with personalized video close 34% faster.
        </button>

        <button
          type="button"
          className="w-full text-left bg-white border border-[--qk-pur-m] rounded-[10px] px-2.5 py-2 text-[12px] leading-relaxed hover:bg-[--qk-pur-l] hover:border-purple-300 transition-all mb-3 outline-none focus-visible:ring-2 focus-visible:ring-[--qk-pur] cursor-pointer"
          onClick={() => {
            onApplyAddon('Technical SEO & Audit Add-on', 450);
            toast.success('SEO Audit add-on added!');
          }}
        >
          <div className="text-[10px] font-bold text-[--qk-pur] mb-[2px] flex items-center gap-[3px]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Upsell Opportunity
          </div>
          Add technical SEO audit at $450 — increases deal value by 5%.
        </button>
      </div>

      <div className="border border-[--qk-bdr] rounded-[14px] overflow-hidden">
        <div className="px-3 py-2 bg-[--qk-s1] border-b border-[--qk-bdr] flex items-center justify-between text-[12.5px] font-semibold text-[--qk-ink]">
          <span>Score: 89/100</span>
          <span className="text-[11px] text-[--qk-grn] font-semibold">Strong</span>
        </div>
        <InsightRow color="var(--qk-grn)" text="Video intro & ROI calculator added. Excellent engagement drivers." />
        <InsightRow color="var(--qk-amb)" text="Pricing 18% below median. Raise brand design to $4,400." />
        <InsightRow color="var(--qk-grn)" text="Timeline and payment terms are clear." />
      </div>
    </>
  );
}

interface SignPanelProps {
  signature: string | null;
  onSign: (dataUrl: string) => void;
  onClear: () => void;
}

function SignPanel({ signature, onSign, onClear }: SignPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // prevent touch scroll
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSign(canvas.toDataURL());
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-semibold text-[--qk-ink]">E-Signature Authorization</h3>
      
      {signature ? (
        <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] p-3 text-center">
          <p className="text-[11.5px] text-[--qk-ink2] mb-2 font-medium">Currently signed signature:</p>
          <div className="bg-white border border-[--qk-bdr] rounded p-2 inline-block">
            <img src={signature} alt="Client Signature Preview" className="max-h-[80px]" />
          </div>
          <button
            type="button"
            className="block mx-auto mt-3 text-[12px] text-[--qk-red] hover:underline cursor-pointer min-h-[44px]"
            onClick={handleClear}
          >
            Clear signature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[12px] text-[--qk-ink2] leading-relaxed">Sign in the box below to authorize and accept proposal terms:</p>
          
          <div className="border border-[--qk-bdr] rounded-[12px] bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={320}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[160px] bg-white cursor-crosshair"
              aria-label="Signature input canvas"
            />
            <div className="bg-[--qk-bg] border-t border-[--qk-bdr] px-3 py-2 flex justify-between">
              <button
                type="button"
                className="text-[11px] text-[--qk-red] font-semibold cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[--qk-red]"
                onClick={handleClear}
              >
                Clear pad
              </button>
              <span className="text-[10px] text-[--qk-ink3] self-center">Interactive touch & mouse draw</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full px-3 py-[7px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all cursor-pointer min-h-[44px]"
            onClick={handleApply}
          >
            Sign & Accept Proposal
          </button>
        </div>
      )}
    </div>
  );
}

interface InvoicePanelProps {
  proposal: Proposal | null;
  invoices: Invoice[];
  onGenerate: () => void;
  onPay: (id: string) => void;
}

function InvoicePanel({ proposal, invoices, onGenerate, onPay }: InvoicePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-semibold text-[--qk-ink]">Invoicing</h3>
        {invoices.length === 0 && (
          <button
            type="button"
            className="px-2.5 py-[5px] rounded-[8px] border border-[--qk-blue] bg-[--qk-blue] text-white text-[11px] font-semibold hover:bg-[--qk-blue-d] transition-all cursor-pointer"
            onClick={onGenerate}
          >
            Create invoice
          </button>
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[12px] p-4 text-center">
          <p className="text-[12px] text-[--qk-ink2] leading-relaxed">No invoices linked to this proposal yet.</p>
          <button
            type="button"
            className="mt-3 px-3 py-[6px] rounded-[10px] border border-[--qk-bdr] bg-white text-[--qk-ink] hover:bg-[--qk-s1] text-[12.5px] font-semibold cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] min-h-[44px]"
            onClick={onGenerate}
          >
            Generate draft invoice
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {invoices.map((inv, idx) => (
            <div key={idx} className="bg-white border border-[--qk-bdr] rounded-[12px] p-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[13px] font-semibold text-[--qk-ink]">{inv.invoice_number}</h4>
                  <p className="text-[11px] text-[--qk-ink3] mt-0.5">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex px-[6px] py-[2px] rounded-full text-[10px] font-semibold capitalize ${
                  inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {inv.status}
                </span>
              </div>
              <div className="flex justify-between items-end mt-3 border-t border-[--qk-bdr] pt-2">
                <span className="text-[13px] font-bold text-[--qk-ink]">{inv.total.toLocaleString('en-US', { style: 'currency', currency: proposal?.currency || 'CAD' })}</span>
                {inv.status !== 'paid' && (
                  <button
                    type="button"
                    className="px-2 py-[4px] bg-[--qk-grn] hover:bg-green-700 text-white rounded text-[11px] font-semibold cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--qk-grn]"
                    onClick={() => onPay(inv.id)}
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PricingPanelProps {
  items: LineItem[];
  currency: string;
  onAdd: (desc: string, qty: number, price: number) => void;
  onDelete: (id: string) => void;
}

function PricingPanel({ items, currency, onAdd, onDelete }: PricingPanelProps) {
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      toast.error('Description is required');
      return;
    }
    onAdd(desc.trim(), qty, price);
    setDesc('');
    setQty(1);
    setPrice(100);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-semibold text-[--qk-ink]">Line Items Management</h3>

      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[10px] p-2 flex justify-between items-center text-[12px]">
            <div className="flex-1 truncate mr-2">
              <span className="font-semibold text-[--qk-ink] block truncate">{item.description}</span>
              <span className="text-[10px] text-[--qk-ink2]">{item.quantity} × {item.unit_price.toLocaleString('en-US', { style: 'currency', currency })}</span>
            </div>
            {item.id && (
              <button
                type="button"
                className="text-[--qk-red] hover:underline px-1 cursor-pointer font-medium min-h-[44px]"
                onClick={() => onDelete(item.id!)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[--qk-bdr] pt-3.5 space-y-3">
        <h4 className="text-[12px] font-semibold text-[--qk-ink]">Add New Item</h4>
        
        <div>
          <label htmlFor="item-desc" className="block text-[11px] font-medium text-[--qk-ink2] mb-1">Description</label>
          <input
            id="item-desc"
            type="text"
            required
            placeholder="e.g. Web Development"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m] focus-visible:ring-1 focus-visible:ring-[--qk-blue]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="item-qty" className="block text-[11px] font-medium text-[--qk-ink2] mb-1">Quantity</label>
            <input
              id="item-qty"
              type="number"
              min="0.25"
              step="0.25"
              required
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m]"
            />
          </div>
          <div>
            <label htmlFor="item-price" className="block text-[11px] font-medium text-[--qk-ink2] mb-1">Unit Price ({currency})</label>
            <input
              id="item-price"
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-[6px] rounded-[8px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[12.5px] font-semibold hover:bg-[--qk-blue-d] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all cursor-pointer min-h-[44px]"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

interface SendPanelProps {
  clientEmail?: string;
  clientName?: string;
  proposalTitle?: string;
  proposalId?: string;
}

function SendPanel({ clientEmail = '', clientName = '', proposalTitle = '', proposalId = '' }: SendPanelProps) {
  const [email, setEmail] = useState(clientEmail);
  const [subject, setSubject] = useState(`Proposal: ${proposalTitle}`);
  const [note, setNote] = useState(`Hi ${clientName},\n\nI have generated the proposal for our project. Let me know if you have any questions!\n\nBest regards`);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setEmail(clientEmail);
    setSubject(`Proposal: ${proposalTitle}`);
    setNote(`Hi ${clientName},\n\nI have generated the proposal for our project. Let me know if you have any questions!\n\nBest regards`);
  }, [clientEmail, clientName, proposalTitle]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setSending(true);
    try {
      // Simulate/trigger Resend endpoint
      // We will perform a Supabase RLS update of the status to 'sent'
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'sent' })
        .eq('id', proposalId);

      if (error) throw error;

      // Mock email log to events
      await supabase.from('proposal_events').insert({
        proposal_id: proposalId,
        event_type: 'sent',
        metadata: { to: email, subject }
      });

      toast.success(`✓ Proposal sent to ${email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send proposal');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <h3 className="text-[13px] font-semibold text-[--qk-ink]">Send Proposal</h3>

      <div>
        <label htmlFor="send-email" className="block text-[11.5px] font-medium text-[--qk-ink2] mb-1">To (Client Email)</label>
        <input
          id="send-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m] focus-visible:ring-1 focus-visible:ring-[--qk-blue]"
        />
      </div>

      <div>
        <label htmlFor="send-subject" className="block text-[11.5px] font-medium text-[--qk-ink2] mb-1">Subject</label>
        <input
          id="send-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m] focus-visible:ring-1 focus-visible:ring-[--qk-blue]"
        />
      </div>

      <div>
        <label htmlFor="send-note" className="block text-[11.5px] font-medium text-[--qk-ink2] mb-1">Personal Note</label>
        <textarea
          id="send-note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-[8px] py-[5px] border border-[--qk-bdr] rounded-[8px] text-[12.5px] bg-[--qk-s1] text-[--qk-ink] outline-none focus:border-[--qk-blue-m] focus-visible:ring-1 focus-visible:ring-[--qk-blue] resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full py-[6px] rounded-[8px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[12.5px] font-semibold hover:bg-[--qk-blue-d] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send via Resend API'}
      </button>
    </form>
  );
}

function TrackPanel({ events }: { events: ProposalEvent[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[13px] font-semibold text-[--qk-ink]">Client Activity Log</h3>
        <div className="flex items-center gap-1 text-[11px] text-[--qk-grn]">
          <span className="w-1.5 h-1.5 rounded-full bg-[--qk-grn] animate-pulse" aria-hidden="true"></span>
          Live
        </div>
      </div>

      <div className="border border-[--qk-bdr] rounded-[14px] bg-[--qk-s0] divide-y divide-[--qk-bdr] max-h-[220px] overflow-y-auto pr-1">
        {events.map((e, idx) => (
          <div key={idx} className="flex gap-2 px-3 py-2 text-[12px] leading-normal">
            <div className="flex flex-col items-center flex-shrink-0 pt-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-[--qk-blue]"></span>
            </div>
            <div className="flex-1">
              <span className="capitalize text-[--qk-ink] font-medium">{e.event_type}</span>
              {e.metadata?.to && <span className="text-[--qk-ink2]"> to {e.metadata.to}</span>}
              <div className="text-[10px] text-[--qk-ink3] mt-0.5">
                {new Date(e.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="py-4 text-center text-[12px] text-[--qk-ink3] italic">
            No activity tracked yet.
          </div>
        )}
      </div>

      <div className="bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-[14px] p-3 text-[12px] text-green-950 leading-relaxed">
        <strong className="block font-semibold text-[--qk-grn] mb-0.5">Engagement signal</strong>
        Engagement logs track client actions in real-time. Share the portal link below to start collecting data.
      </div>
    </div>
  );
}

function AutoPanel() {
  const [createProj, setCreateProj] = useState(true);
  const [sendInvoice, setSendInvoice] = useState(true);
  const [kickoff, setKickoff] = useState(true);

  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-semibold text-[--qk-ink]">Post-Acceptance Workflows</h3>
      
      <div className="bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-[14px] p-3.5 space-y-3">
        <p className="text-[12px] font-medium text-green-950">When this proposal is accepted by client:</p>
        
        <div className="space-y-2">
          <AutoStep id="au-proj" text="Create project from standard template" checked={createProj} onChange={setCreateProj} />
          <AutoStep id="au-inv" text="Send 50% deposit invoice automatically" checked={sendInvoice} onChange={setSendInvoice} />
          <AutoStep id="au-kick" text="Send kickoff onboarding questionnaire" checked={kickoff} onChange={setKickoff} />
        </div>
      </div>

      <button
        type="button"
        className="w-full py-[6px] rounded-[10px] bg-[--qk-blue] border border-[--qk-blue] text-white text-[13px] font-semibold hover:bg-[--qk-blue-d] outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] transition-all cursor-pointer min-h-[44px]"
        onClick={() => toast.info('Automations updated!')}
      >
        Save workflow automations
      </button>
    </div>
  );
}

function AutoStep({ id, text, checked, onChange }: { id: string; text: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-green-950">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-[--qk-grn] bg-green-50 border-green-300 rounded focus:ring-green-500 focus-visible:ring-2 cursor-pointer"
      />
      <label htmlFor={id} className="cursor-pointer">{text}</label>
    </div>
  );
}

function InsightRow({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-[9px] border-b border-[--qk-bdr] last:border-0 text-[12px] text-[--qk-ink2] leading-relaxed">
      <div className="w-[7px] h-[7px] rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} aria-hidden="true"></div>
      <div>{text}</div>
    </div>
  );
}
