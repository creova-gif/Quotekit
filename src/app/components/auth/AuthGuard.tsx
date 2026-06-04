import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useInRouterContext } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { PlanId, PlanLimit } from '../../../lib/types';
import { getPlan } from '../../../lib/plans';
import { Loader2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export interface AuthGuardProps {
  children: ReactNode;
  allowedPlans?: PlanId[];
  fallback?: ReactNode;
}

interface AuthGuardInnerProps extends AuthGuardProps {
  location: Location | null;
  navigate: ReturnType<typeof useNavigate> | null;
  isInRouter: boolean;
}

export function AuthLoadingScreen() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-qk-bg font-sans"
      style={{ fontFamily: 'var(--qk-sans)' }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* QuoteKit Logo Icon & Text */}
        <div className="flex items-center gap-3 select-none animate-pulse">
          <div className="w-10 h-10 bg-qk-blue rounded-xl flex items-center justify-center shadow-md">
            <svg width="18" height="18" fill="#fff" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z" />
            </svg>
          </div>
          <span
            className="text-3xl font-semibold text-qk-ink tracking-tight"
            style={{ fontFamily: 'var(--qk-serif)' }}
          >
            Quote<em className="italic text-qk-blue">Kit</em>
          </span>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-2.5 text-qk-ink2 mt-2">
          <Loader2 className="w-6 h-6 animate-spin text-qk-blue" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide">Loading workspace...</span>
        </div>
      </div>
    </div>
  );
}

export function AuthErrorScreen({ error }: { error: Error }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-qk-bg px-4 font-sans"
      style={{ fontFamily: 'var(--qk-sans)' }}
    >
      <div className="w-full max-w-[440px] bg-white border border-qk-bdr rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center text-center gap-6">
        {/* QuoteKit Logo Icon & Text */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 bg-qk-blue rounded-xl flex items-center justify-center shadow-md">
            <svg width="18" height="18" fill="#fff" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z" />
            </svg>
          </div>
          <span
            className="text-3xl font-semibold text-qk-ink tracking-tight"
            style={{ fontFamily: 'var(--qk-serif)' }}
          >
            Quote<em className="italic text-qk-blue">Kit</em>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl font-bold tracking-tight text-qk-ink"
            style={{ fontFamily: 'var(--qk-serif)' }}
          >
            Authentication Error
          </h1>
          <p className="text-sm text-qk-ink2 max-w-sm">
            {error.message || 'An unexpected error occurred while setting up your workspace.'}
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="w-full h-11 text-base font-semibold bg-qk-blue hover:bg-qk-blue-d text-white transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:ring-offset-2 outline-none flex items-center justify-center"
        >
          Reload Workspace
        </Button>
      </div>
    </div>
  );
}

interface DefaultUpgradeRequiredProps {
  allowedPlans: PlanId[];
  currentPlan: PlanId;
  navigate: ReturnType<typeof useNavigate> | null;
  userCurrency?: string;
}

function DefaultUpgradeRequired({
  allowedPlans,
  currentPlan,
  navigate,
  userCurrency = 'USD',
}: DefaultUpgradeRequiredProps) {
  const planOrder: Record<PlanId, number> = { starter: 0, pro: 1, business: 2 };

  // Sort to find the lowest allowed plan that the user needs to reach
  const sortedAllowed = [...allowedPlans].sort((a, b) => planOrder[a] - planOrder[b]);
  const requiredPlanId = sortedAllowed[0] || 'pro';

  const currentPlanDetails = getPlan(currentPlan);
  const requiredPlanDetails = getPlan(requiredPlanId);

  const formatLimitValue = (key: keyof PlanLimit, val: PlanLimit[keyof PlanLimit]) => {
    if (val === 'unlimited') return 'Unlimited';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (key === 'aiGenerations') return `${val} runs/mo`;
    if (key === 'proposals') return `${val} proposals/mo`;
    if (key === 'clients') return `${val} clients`;
    if (key === 'teamSeats') {
      const num = typeof val === 'number' ? val : 1;
      return `${num} seat${num !== 1 ? 's' : ''}`;
    }
    return String(val);
  };

  const featuresToCompare: { name: string; key: keyof PlanLimit }[] = [
    { name: 'Monthly Proposals', key: 'proposals' },
    { name: 'Clients Limit', key: 'clients' },
    { name: 'AI Generations', key: 'aiGenerations' },
    { name: 'Team Seats', key: 'teamSeats' },
    { name: 'White-Label Portal', key: 'whiteLabel' },
    { name: 'Stripe Payouts', key: 'stripePayout' },
  ];

  if (requiredPlanId === 'business') {
    featuresToCompare.push({ name: 'Custom Domain', key: 'customDomain' });
    featuresToCompare.push({ name: 'M-Pesa Payments', key: 'mpesa' });
  }

  const currentPrice = userCurrency === 'CAD' ? currentPlanDetails.priceCAD : currentPlanDetails.priceUSD;
  const requiredPrice = userCurrency === 'CAD' ? requiredPlanDetails.priceCAD : requiredPlanDetails.priceUSD;

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: userCurrency }).format(price) + '/mo';
  };

  const handleUpgradeClick = () => {
    if (navigate) {
      navigate('/settings?tab=billing');
    } else {
      window.location.href = '/settings?tab=billing';
    }
  };

  const handleBackClick = () => {
    if (navigate) {
      navigate('/dashboard');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-qk-bg px-4 py-12 sm:px-6 lg:px-8 font-sans"
      style={{ fontFamily: 'var(--qk-sans)' }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-[10px] select-none mb-8">
        <div className="w-[32px] h-[32px] bg-qk-blue rounded-[8px] flex items-center justify-center">
          <svg width="15" height="15" fill="#fff" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z" />
          </svg>
        </div>
        <span
          className="text-[22px] font-semibold text-qk-ink tracking-[-0.3px]"
          style={{ fontFamily: 'var(--qk-serif)' }}
        >
          Quote<em className="italic text-qk-blue">Kit</em>
        </span>
      </div>

      <div className="w-full max-w-[640px] bg-white border border-qk-bdr rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-qk-pur-l text-qk-pur border border-qk-pur-m mb-4">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Premium Feature
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-qk-ink"
            style={{ fontFamily: 'var(--qk-serif)' }}
          >
            Feature Gate — Upgrade Required
          </h1>

          <p className="text-sm sm:text-base text-qk-ink2 mt-3 max-w-md">
            This feature requires a <span className="font-semibold text-qk-ink">{requiredPlanDetails.name}</span> plan or higher. You are currently on the <span className="font-semibold text-qk-ink">{currentPlanDetails.name}</span> plan.
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="border border-qk-bdr rounded-xl overflow-hidden bg-qk-bg">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-qk-s1 text-xs font-semibold text-qk-ink2 uppercase tracking-wider border-b border-qk-bdr">
              <tr>
                <th scope="col" className="w-1/3 px-4 py-3 text-left font-semibold">Feature</th>
                <th scope="col" className="w-1/3 px-4 py-3 text-center font-semibold">{currentPlanDetails.name}</th>
                <th scope="col" className="w-1/3 px-4 py-3 text-center font-bold text-qk-blue">{requiredPlanDetails.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-qk-bdr">
              {/* Price Row */}
              <tr className="bg-qk-blue-l/20">
                <th scope="row" className="px-4 py-3 text-left font-semibold text-qk-ink">Price</th>
                <td className="px-4 py-3 text-center text-qk-ink2">{formatPrice(currentPrice)}</td>
                <td className="px-4 py-3 text-center text-qk-blue font-bold">{formatPrice(requiredPrice)}</td>
              </tr>

              {/* Limits Rows */}
              {featuresToCompare.map((feat) => {
                const curVal = currentPlanDetails.limits[feat.key];
                const reqVal = requiredPlanDetails.limits[feat.key];
                const hasFeature = typeof reqVal === 'boolean' ? reqVal : reqVal !== curVal;
                return (
                  <tr key={feat.key}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-qk-ink">{feat.name}</th>
                    <td className="px-4 py-3 text-center text-qk-ink2">{formatLimitValue(feat.key, curVal)}</td>
                    <td
                      className={cn(
                        'px-4 py-3 text-center font-semibold text-qk-ink2',
                        hasFeature && 'text-qk-blue'
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {typeof reqVal === 'boolean' && reqVal ? (
                          <Check className="w-4 h-4 text-qk-grn" aria-hidden="true" />
                        ) : null}
                        {formatLimitValue(feat.key, reqVal)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            onClick={handleUpgradeClick}
            className="flex-1 h-11 text-base font-semibold bg-qk-blue hover:bg-qk-blue-d text-white transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:ring-offset-2 outline-none flex items-center justify-center gap-2"
          >
            Upgrade to {requiredPlanDetails.name}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="h-11 px-6 text-base font-semibold border border-qk-bdr hover:bg-qk-s1 text-qk-ink2 hover:text-qk-ink transition-all cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:ring-offset-2 outline-none"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuthGuardInner({
  children,
  allowedPlans,
  fallback,
  location,
  navigate,
  isInRouter,
}: AuthGuardInnerProps) {
  const { user, profile, loading, error } = useAuth();

  // Redirect side-effect in useEffect to avoid render warnings in React 18
  useEffect(() => {
    if (!loading && !user && !isInRouter) {
      const nextUrl = window.location.pathname + window.location.search;
      window.location.href = `/login?from=${encodeURIComponent(nextUrl)}`;
    }
  }, [loading, user, isInRouter]);

  // 1. Error state
  if (error) {
    return <AuthErrorScreen error={error} />;
  }

  // 2. Loading state
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // 3. Unauthenticated state
  if (!user) {
    if (isInRouter) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    } else {
      return <AuthLoadingScreen />;
    }
  }

  // 4. Plan authorization checks
  if (allowedPlans && allowedPlans.length > 0) {
    const userPlan = profile?.plan ?? 'starter';
    const isAllowed = allowedPlans.includes(userPlan);

    if (!isAllowed) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <DefaultUpgradeRequired
          allowedPlans={allowedPlans}
          currentPlan={userPlan}
          navigate={navigate}
          userCurrency={profile?.currency || 'USD'}
        />
      );
    }
  }

  return <>{children}</>;
}

export function AuthGuard(props: AuthGuardProps) {
  const isInRouter = useInRouterContext();
  if (isInRouter) {
    return <AuthGuardWithRouter {...props} />;
  }
  return <AuthGuardWithoutRouter {...props} />;
}

// Router-based wrapper
function AuthGuardWithRouter(props: AuthGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AuthGuardInner
      {...props}
      location={location}
      navigate={navigate}
      isInRouter={true}
    />
  );
}

// Routerless wrapper
function AuthGuardWithoutRouter(props: AuthGuardProps) {
  return (
    <AuthGuardInner
      {...props}
      location={null}
      navigate={null}
      isInRouter={false}
    />
  );
}
