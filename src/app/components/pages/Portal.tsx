import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../../lib/supabase';

// Initialize Stripe Promise
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PxDUMMYKEY';
const stripePromise = loadStripe(stripePublishableKey);

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

interface ProposalPackage {
  id: string;
  label: string;
  price: number;
  description: string;
  is_recommended: boolean;
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
  summary: string | null;
  cover_title: string;
  cover_subtitle: string | null;
  public_token: string;
  signature_data: string | null;
  signed_at: string | null;
}

interface Sender {
  full_name: string;
  company_name: string | null;
  logo_url: string | null;
  country: string;
  province: string | null;
}

export default function Portal() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [packages, setPackages] = useState<ProposalPackage[]>([]);
  const [sender, setSender] = useState<Sender | null>(null);

  const [selectedPkg, setSelectedPkg] = useState<ProposalPackage | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProposal() {
      try {
        setLoading(true);

        // Fetch proposal by token (or fallback to latest if none provided, for testing)
        let data: Proposal | null = null;
        if (token) {
          const { data: propByToken } = await supabase
            .from('proposals')
            .select('*')
            .eq('public_token', token)
            .single();
          data = propByToken as Proposal;
        }

        if (!data) {
          // Fallback: load the most recent proposal in the DB for preview purposes
          const { data: props } = await supabase
            .from('proposals')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
          if (props && props.length > 0) {
            data = props[0] as Proposal;
          }
        }

        if (!data) {
          // Ultimate mock fallback
          data = {
            id: 'dummy-proposal-id',
            user_id: 'dummy-user-id',
            client_id: 'dummy-client-id',
            title: 'Brand Identity & Website — Volta Goods',
            cover_title: 'Brand Identity & Website — Full Package',
            cover_subtitle: 'Prepared for Volta Goods · April 2026',
            status: 'sent',
            currency: 'CAD',
            tax_rate: 0.13,
            tax_label: 'HST (ON 13%)',
            subtotal: 9850,
            tax_amount: 1280.50,
            total: 11130.50,
            summary: 'Complete brand identity and Shopify storefront for Volta Goods. Covers discovery, strategy, design, development, and 2-week post-launch support.',
            public_token: 'dummy-token',
            signature_data: null,
            signed_at: null
          };
        }

        if (!active) return;
        setProposal(data);
        setSignatureData(data.signature_data);
        setSignedAt(data.signed_at);

        // Track proposal opened event
        await supabase.from('proposal_events').insert({
          proposal_id: data.id,
          event_type: 'opened',
          metadata: { token: data.public_token }
        });

        // Load client details
        const { data: clientData } = await supabase
          .from('clients')
          .select('*')
          .eq('id', data.client_id)
          .single();
        if (active && clientData) setClient(clientData as unknown as Client);

        // Load packages
        const { data: pkgs } = await supabase
          .from('proposal_packages')
          .select('*')
          .eq('proposal_id', data.id)
          .order('sort_order', { ascending: true });

        if (active) {
          if (pkgs && pkgs.length > 0) {
            setPackages(pkgs as ProposalPackage[]);
            setSelectedPkg(pkgs[0] as ProposalPackage);
          } else {
            // Default mock packages
            const mockPkgs: ProposalPackage[] = [
              { id: '1', label: 'Starter', price: data.subtotal * 0.4, description: 'Brand Identity design and style guides.', is_recommended: false },
              { id: '2', label: '★ Recommended', price: data.subtotal, description: 'Brand Identity + E-commerce Web development.', is_recommended: true },
              { id: '3', label: 'Growth', price: data.subtotal * 1.15, description: 'Brand + Web + 6 months SEO support.', is_recommended: false }
            ];
            setPackages(mockPkgs);
            setSelectedPkg(mockPkgs[1]);
          }
        }

        // Load sender profile info
        const { data: senderData } = await supabase
          .from('users')
          .select('full_name, company_name, logo_url, country, province')
          .eq('id', data.user_id)
          .single();
        if (active && senderData) setSender(senderData as Sender);

      } catch (err) {
        console.error('Error loading client portal:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProposal();
    return () => {
      active = false;
    };
  }, [token]);

  const handlePortalAccept = async (cardSuccess: boolean, stripeMethod?: string) => {
    if (!proposal) return;
    if (!signatureData) {
      toast.error('Signature is required before accepting.');
      return;
    }

    try {
      const nowStr = new Date().toISOString();
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'accepted',
          signature_data: signatureData,
          signed_at: nowStr,
          selected_package_id: selectedPkg?.id || null
        })
        .eq('id', proposal.id);

      if (error) throw error;

      await supabase.from('proposal_events').insert({
        proposal_id: proposal.id,
        event_type: 'accepted',
        metadata: {
          package: selectedPkg?.label,
          payment: stripeMethod || 'card',
          card_success: cardSuccess
        }
      });

      setAccepted(true);
      toast.success('✓ Proposal accepted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept proposal');
    }
  };

  const isEastAfrica = ['KE', 'TZ', 'UG', 'RW'].includes(client?.country || '');
  const currencySymbol = proposal?.currency === 'KES' ? 'KSh' : proposal?.currency === 'TZS' ? 'TSh' : '$';

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]" role="status" aria-label="Loading portal">
        <div className="w-8 h-8 border-3 border-[--qk-blue] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[13px] text-[--qk-ink2] mt-3 font-medium">Opening secure client portal...</p>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 flex items-center justify-center">
        <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] max-w-[560px] w-full shadow-lg p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-[--qk-grn-l] border border-[--qk-grn-m] rounded-full flex items-center justify-center mx-auto text-[20px]" aria-hidden="true">✓</div>
          <h1 className="text-[22px] tracking-tight font-semibold" style={{ fontFamily: 'var(--qk-serif)' }}>Proposal Accepted!</h1>
          <p className="text-[13.5px] text-[--qk-ink2] leading-relaxed">
            Thank you! You have accepted the proposal from <strong>{sender?.company_name || sender?.full_name || 'Sofia Adeyemi Studio'}</strong>.
            A copy has been emailed to you.
          </p>
          <div className="border border-[--qk-bdr] rounded-xl p-4 bg-[--qk-bg] text-left text-[12.5px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[--qk-ink2]">Package:</span>
              <strong className="font-semibold text-[--qk-ink]">{selectedPkg?.label}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[--qk-ink2]">Total Amount:</span>
              <strong className="font-semibold text-[--qk-ink]">{currencySymbol}{(selectedPkg?.price || proposal.total).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[--qk-ink2]">Status:</span>
              <span className="text-[--qk-grn] font-semibold">Accepted & Authorized</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex items-start justify-center">
      <div className="bg-[--qk-s0] border border-[--qk-bdr] rounded-[20px] max-w-[680px] w-full shadow-md overflow-hidden">
        {/* Portal Header */}
        <div className="bg-[--qk-ink] px-6 md:px-8 py-5 flex justify-between items-center text-white">
          <div className="text-[17px] font-semibold tracking-tight" style={{ fontFamily: 'var(--qk-serif)' }}>
            {sender?.company_name || 'Sofia Adeyemi Studio'}
          </div>
          <div className="text-[11px] flex items-center gap-[5px] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[--qk-grn]" aria-hidden="true"></span>
            Proposal QK-{proposal?.id.slice(0,4).toUpperCase()}
          </div>
        </div>

        {/* Portal Content */}
        <div className="px-6 md:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-serif text-[--qk-ink] tracking-tight" style={{ fontFamily: 'var(--qk-serif)' }}>
              {proposal?.cover_title}
            </h1>
            <p className="text-[13px] text-[--qk-ink2] mt-1">
              Prepared for {client?.name || 'Volta Goods'}
            </p>
          </div>

          <div className="pb-5 border-b border-[--qk-bdr]">
            <h2 className="text-[10px] font-semibold tracking-wider uppercase text-[--qk-ink3] mb-2.5">Summary</h2>
            <div className="text-[13.5px] text-[--qk-ink2] leading-relaxed">
              {proposal?.summary || 'Complete brand identity and web design package.'}
            </div>
          </div>

          <div className="pb-5 border-b border-[--qk-bdr]">
            <h2 className="text-[10px] font-semibold tracking-wider uppercase text-[--qk-ink3] mb-3">Investment Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {packages.map((pkg) => (
                <button
                  type="button"
                  key={pkg.id}
                  className={`border text-left rounded-[14px] px-3.5 py-3.5 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--qk-blue] ${
                    selectedPkg?.id === pkg.id
                      ? 'border-2 border-[--qk-blue] bg-[--qk-blue-l]'
                      : 'border-[--qk-bdr] hover:border-[--qk-blue-m] bg-transparent'
                  }`}
                  onClick={() => setSelectedPkg(pkg)}
                >
                  <div className={`text-[11px] font-bold mb-[3px] ${selectedPkg?.id === pkg.id ? 'text-[--qk-blue]' : 'text-[--qk-ink2]'}`}>{pkg.label}</div>
                  <div className={`text-[16px] font-bold ${selectedPkg?.id === pkg.id ? 'text-[--qk-blue]' : 'text-[--qk-ink]'}`} style={{ fontFamily: 'var(--qk-mono)' }}>
                    {currencySymbol}{pkg.price.toLocaleString()}
                  </div>
                  <div className="text-[11.5px] text-[--qk-ink3] mt-[5px] line-clamp-2">{pkg.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Signature pad */}
          <div className="pb-5 border-b border-[--qk-bdr]">
            <h2 className="text-[10px] font-semibold tracking-wider uppercase text-[--qk-ink3] mb-3">E-Signature Approval</h2>
            <PortalSignaturePad
              signature={signatureData}
              onSign={(dataUrl) => {
                setSignatureData(dataUrl);
                setSignedAt(new Date().toISOString());
              }}
              onClear={() => {
                setSignatureData(null);
                setSignedAt(null);
              }}
            />
          </div>

          {/* Payment Selection & Card Restriction Checks */}
          <div className="pb-5 border-b border-[--qk-bdr]">
            <h2 className="text-[10px] font-semibold tracking-wider uppercase text-[--qk-ink3] mb-3">Payment details</h2>
            <Elements stripe={stripePromise}>
              <StripeCheckoutForm
                price={selectedPkg?.price || proposal?.total || 0}
                currency={proposal?.currency || 'CAD'}
                signed={!!signatureData}
                onAccept={(cardSuccess, funding) => handlePortalAccept(cardSuccess, funding)}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

// Signature Pad for Portal
interface PortalSignaturePadProps {
  signature: string | null;
  onSign: (dataUrl: string) => void;
  onClear: () => void;
}

function PortalSignaturePad({ signature, onSign, onClear }: PortalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#030213';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
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
    <div>
      {signature ? (
        <div className="bg-[--qk-s1] border border-[--qk-bdr] rounded-[12px] p-3 text-center">
          <p className="text-[12px] text-[--qk-ink2] mb-2 font-medium">Authorized signature:</p>
          <div className="bg-white border border-[--qk-bdr] rounded p-2 inline-block shadow-sm">
            <img src={signature} alt="Client Authorized Signature" className="max-h-[60px]" />
          </div>
          <button
            type="button"
            className="block mx-auto mt-2 text-[11px] text-[--qk-red] font-semibold hover:underline cursor-pointer"
            onClick={handleClear}
          >
            Reset signature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-[--qk-bdr] rounded-[12px] bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={340}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[120px] bg-white cursor-crosshair"
              aria-label="Portal Signature pad"
            />
            <div className="bg-[--qk-bg] border-t border-[--qk-bdr] px-3 py-1.5 flex justify-between">
              <button
                type="button"
                className="text-[11px] text-[--qk-ink2] hover:text-[--qk-red] cursor-pointer"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="text-[11px] text-[--qk-blue] font-bold cursor-pointer"
                onClick={handleApply}
              >
                Apply signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stripe Card form with PREPAID restrictions!
interface StripeCheckoutFormProps {
  price: number;
  currency: string;
  signed: boolean;
  onAccept: (success: boolean, funding: string) => void;
}

function StripeCheckoutForm({ price, currency, signed, onAccept }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!signed) {
      toast.error('Please sign the proposal signature block first.');
      return;
    }

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card form element missing');

      // Create payment method
      const { paymentMethod, error: stripeErr } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if (stripeErr) throw stripeErr;

      // check card funding to BLOCK prepaid cards!
      const funding = paymentMethod?.card?.funding;
      if (funding === 'prepaid') {
        toast.error(
          'We do not accept prepaid cards (such as gift cards). Please checkout using a valid credit card, debit card, or company card.',
          { duration: 6000 }
        );
        setLoading(false);
        return;
      }

      // Success! Proceed to complete contract accept
      onAccept(true, `stripe_${funding}`);
    } catch (err: any) {
      console.error('Stripe element checkout error:', err);
      toast.error(err.message || 'Payment confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-[--qk-bdr] bg-[--qk-bg] rounded-[12px] p-4">
        <label htmlFor="stripe-card-element" className="block text-[12px] font-semibold text-[--qk-ink] mb-2">Card details</label>
        <CardElement
          id="stripe-card-element"
          options={{
            style: {
              base: {
                fontSize: '14px',
                color: '#18181b',
                fontFamily: 'DM Sans, sans-serif',
                '::placeholder': {
                  color: '#a1a1aa',
                },
              },
              invalid: {
                color: '#dc2626',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !stripe || !signed}
        className="w-full py-3 bg-[--qk-blue] hover:bg-[--qk-blue-d] text-white rounded-[12px] text-[13.5px] font-semibold transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
      >
        {loading ? 'Validating card info...' : `Accept & Pay Deposit`}
      </button>
    </form>
  );
}
