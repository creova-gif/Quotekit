import React, { useState } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  EyeIcon,
  EyeOffIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

export type AuthMode = 'signin' | 'signup' | 'magiclink' | 'forgot';

interface LoginPageProps {
  onAuthSuccess?: () => void;
  defaultMode?: AuthMode;
}

function LoginPageInner({
  onAuthSuccess,
  defaultMode = 'signin',
  navigate,
}: LoginPageProps & { navigate: ReturnType<typeof useNavigate> | null }) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('CA');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedCompanyName = companyName.trim();

    try {
      if (mode === 'signin') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (authError) throw authError;

        setSuccessMessage('Logged in successfully!');
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        if (navigate) {
          navigate('/dashboard');
        }
      } else if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedFullName,
              company_name: trimmedCompanyName || null,
              country,
            },
          },
        });
        if (authError) throw authError;

        if (data.session) {
          setSuccessMessage('Account created and logged in successfully!');
          if (onAuthSuccess) {
            onAuthSuccess();
          }
          if (navigate) {
            navigate('/dashboard');
          }
        } else {
          setSuccessMessage('Registration successful! Please check your email for a confirmation link.');
        }
      } else if (mode === 'magiclink') {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: trimmedEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (authError) throw authError;

        setSuccessMessage('Magic link sent! Check your email to sign in passwordlessly.');
      } else if (mode === 'forgot') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (authError) throw authError;

        setSuccessMessage('Password reset request sent! Check your email for a reset link.');
      }
    } catch (err: unknown) {
      console.error(`[Auth] Error in ${mode}:`, err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
        errorMessage = (err as any).message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Welcome back';
      case 'signup':
        return 'Create your account';
      case 'magiclink':
        return 'Sign in with Magic Link';
      case 'forgot':
        return 'Reset your password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin':
        return 'Enter your credentials to access your dashboard.';
      case 'signup':
        return 'Get full access to QuoteKit features.';
      case 'magiclink':
        return "We'll send you a secure link to log in passwordlessly.";
      case 'forgot':
        return "Enter your email and we'll send you a password reset link.";
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center bg-qk-bg px-4 py-12 sm:px-6 lg:px-8 font-sans"
      style={{ fontFamily: 'var(--qk-sans)' }}
    >
      {/* Off-screen live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {error ? `Error: ${error}` : ''}
        {successMessage ? `Success: ${successMessage}` : ''}
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-[10px] select-none">
          <div className="w-[32px] h-[32px] bg-qk-blue rounded-[8px] flex items-center justify-center">
            <svg width="15" height="15" fill="#fff" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 3h8l3 4.5-3 4.5H2l3-4.5z" />
            </svg>
          </div>
          <span className="text-[22px] font-semibold text-qk-ink tracking-[-0.3px]" style={{ fontFamily: 'var(--qk-serif)' }}>
            Quote<em className="italic text-qk-blue">Kit</em>
          </span>
        </div>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] bg-white border border-qk-bdr rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex flex-col gap-1.5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-qk-ink" style={{ fontFamily: 'var(--qk-serif)' }}>
              {getTitle()}
            </h1>
            <p className="text-sm text-qk-ink2">{getDescription()}</p>
          </div>

          {/* Tab Selector */}
          {mode !== 'forgot' && (
            <div
              className="flex bg-qk-s1 p-1 rounded-lg border border-qk-bdr gap-1"
              role="tablist"
              aria-label="Authentication Modes"
            >
              <button
                id="tab-signin"
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                aria-controls="auth-tabpanel"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:outline-none',
                  mode === 'signin'
                    ? 'bg-white text-qk-ink shadow-xs'
                    : 'text-qk-ink2 hover:text-qk-ink'
                )}
              >
                Sign In
              </button>
              <button
                id="tab-signup"
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                aria-controls="auth-tabpanel"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:outline-none',
                  mode === 'signup'
                    ? 'bg-white text-qk-ink shadow-xs'
                    : 'text-qk-ink2 hover:text-qk-ink'
                )}
              >
                Sign Up
              </button>
              <button
                id="tab-magiclink"
                type="button"
                role="tab"
                aria-selected={mode === 'magiclink'}
                aria-controls="auth-tabpanel"
                onClick={() => {
                  setMode('magiclink');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className={cn(
                  'flex-1 py-2 text-sm font-medium rounded-md transition-all min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:outline-none',
                  mode === 'magiclink'
                    ? 'bg-white text-qk-ink shadow-xs'
                    : 'text-qk-ink2 hover:text-qk-ink'
                )}
              >
                Magic Link
              </button>
            </div>
          )}

          {/* Free Trial Banner for Sign Up */}
          {mode === 'signup' && (
            <div className="bg-qk-blue-l border border-qk-blue-m text-qk-blue-d rounded-xl p-3.5 text-xs flex gap-2.5 items-center">
              <Sparkles className="w-4.5 h-4.5 text-qk-blue flex-shrink-0" aria-hidden="true" />
              <span className="leading-relaxed">
                <strong>14-day free trial</strong> · No credit card required to start
              </span>
            </div>
          )}

          {/* Success & Error Messages */}
          {successMessage && (
            <div
              className="bg-qk-grn-l border border-qk-grn-m text-qk-grn text-sm p-4 rounded-xl flex items-start gap-3"
              role="alert"
            >
              <CheckCircle2 className="w-5 h-5 text-qk-grn flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-qk-ink">Check email</p>
                <p className="text-qk-ink2 mt-0.5 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div
              className="bg-qk-red-l border border-qk-red-m text-qk-red text-sm p-4 rounded-xl flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-qk-red flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-qk-ink">Unable to complete request</p>
                <p className="text-qk-ink2 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            {...(mode !== 'forgot'
              ? {
                  role: 'tabpanel',
                  id: 'auth-tabpanel',
                  'aria-labelledby': `tab-${mode}`,
                }
              : {})}
          >
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="full-name" className="text-sm font-medium text-qk-ink">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 text-base focus-visible:ring-2 focus-visible:ring-qk-blue"
                  placeholder="Sofia Adeyemi"
                />
              </div>
            )}

            {/* Email (All modes) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-qk-ink">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                required
                autoComplete={mode === 'signin' ? 'username' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 text-base focus-visible:ring-2 focus-visible:ring-qk-blue"
                placeholder="sofia@studiosa.co"
              />
            </div>

            {/* Password (Sign In & Sign Up only) */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password-input" className="text-sm font-medium text-qk-ink">
                    Password
                  </Label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs text-qk-blue hover:underline font-semibold focus-visible:ring-2 focus-visible:ring-qk-blue rounded focus-visible:outline-none min-h-[44px] px-2 flex items-center justify-center -my-3 -mr-2 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-12 h-11 text-base focus-visible:ring-2 focus-visible:ring-qk-blue"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-qk-ink3 hover:text-qk-ink p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Company Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="company-name" className="text-sm font-medium text-qk-ink">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-11 text-base focus-visible:ring-2 focus-visible:ring-qk-blue"
                  placeholder="Studio SA"
                />
              </div>
            )}

            {/* Country (Sign Up only) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="country" className="text-sm font-medium text-qk-ink">
                  Country
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger
                    id="country"
                    aria-label="Country"
                    className="h-11 text-base focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:outline-none"
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada (CA)</SelectItem>
                    <SelectItem value="US">United States (US)</SelectItem>
                    <SelectItem value="KE">Kenya (KE)</SelectItem>
                    <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                    <SelectItem value="AU">Australia (AU)</SelectItem>
                    <SelectItem value="DE">Germany (DE)</SelectItem>
                    <SelectItem value="FR">France (FR)</SelectItem>
                    <SelectItem value="IN">India (IN)</SelectItem>
                    <SelectItem value="ZA">South Africa (ZA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold bg-qk-blue hover:bg-qk-blue-d text-white transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-qk-blue focus-visible:ring-offset-2 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'magiclink' && 'Send Magic Link'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </>
              )}
            </Button>
          </form>

          {/* Forgot password mode footer link */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm text-qk-ink2 hover:text-qk-ink font-semibold flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-qk-blue rounded focus-visible:outline-none p-2 mt-2 w-full min-h-[44px] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(props: LoginPageProps) {
  const isInRouter = useInRouterContext();
  if (isInRouter) {
    return <LoginPageWithRouter {...props} />;
  }
  return <LoginPageWithoutRouter {...props} />;
}

function LoginPageWithRouter(props: LoginPageProps) {
  const navigate = useNavigate();
  return <LoginPageInner {...props} navigate={navigate} />;
}

function LoginPageWithoutRouter(props: LoginPageProps) {
  return <LoginPageInner {...props} navigate={null} />;
}
