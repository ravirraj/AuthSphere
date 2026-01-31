import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AuthSphere, { AuthError } from '@authspherejs/sdk';
import { LogOut, Sparkles, ArrowRight, Github, Chrome, MessageSquare, Shield, Mail, Lock, User, CheckCircle2, AlertCircle, RefreshCw, KeyRound, BookOpen, Terminal, Code2, Globe } from 'lucide-react';
import { cn } from './lib/utils';

// --- Initialize SDK ---
AuthSphere.initAuth({
  publicKey: "1b2eb92b0fff434e40146da67219a346",
  redirectUri: window.location.origin + '/callback',
  baseUrl: 'http://localhost:8000'
});

// --- Simple UI Components (Shadcn-like) ---
const Button = ({ children, className, variant = "default", size = "default", loading, icon: Icon, ...props }) => {
  const variants = {
    default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 shadow",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
    ghost: "hover:bg-zinc-100 hover:text-zinc-900",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

const Input = ({ label, className, ...props }) => (
  <div className="grid w-full items-center gap-1.5 mb-4">
    {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);

const Card = ({ children, className }) => (
  <div className={cn("rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow", className)}>
    {children}
  </div>
);

// --- Callback Page ---
const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const errorParam = searchParams.get('error');
    const emailParam = searchParams.get('email');
    const sdkRequest = searchParams.get('sdk_request');

    if (errorParam === 'email_not_verified') {
      navigate(`/verify-otp?email=${emailParam}${sdkRequest ? `&sdk_request=${sdkRequest}` : ''}`);
      return;
    }

    const handle = async () => {
      try {
        await AuthSphere.handleAuthCallback();
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    };
    handle();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/50 p-6">
      {!error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Authenticating...</p>
        </div>
      ) : (
        <Card className="max-w-sm w-full p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
          <p className="text-sm text-zinc-500 mb-6">{error}</p>
          <Button className="w-full" onClick={() => navigate('/login')}>Try Again</Button>
        </Card>
      )}
    </div>
  );
};

// --- Login Page ---
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSocialLogin = (provider) => AuthSphere.redirectToLogin(provider);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await AuthSphere.loginLocal(formData);
    } catch (err) {
      if (err instanceof AuthError && err.message.includes('not verified')) {
        const sdkRequest = err.sdk_request;
        navigate(`/verify-otp?email=${formData.email}${sdkRequest ? `&sdk_request=${sdkRequest}` : ''}`);
      } else {
        setError(err.message || 'Login failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
      <div className="w-full max-w-[400px]">
        <Card className="p-8">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>Sign In</Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSocialLogin('google')} className="w-full">
              <img src="https://authjs.dev/img/providers/google.svg" className="h-4 w-4 mr-2" alt="Google" />
              Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialLogin('github')} className="w-full">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="underline underline-offset-4 hover:text-zinc-900 font-medium">
              Sign up
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

// --- SignUp Page ---
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await AuthSphere.register(formData);
      navigate(`/verify-otp?email=${formData.email}`);
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
      <div className="w-full max-w-[400px]">
        <Card className="p-8">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-zinc-500">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>Register</Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="underline underline-offset-4 hover:text-zinc-900 font-medium">
              Sign in
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

// --- OTP Verification Page ---
const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const sdkRequest = searchParams.get('sdk_request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inputRefs = useRef([]);

  const handleInput = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return setError('Please enter all 6 digits');

    setLoading(true);
    setError('');
    try {
      await AuthSphere.verifyOTP({ email, otp: otpString, sdk_request: sdkRequest });
      if (!sdkRequest) {
        setMessage('Email verified! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // If sdkRequest was present, it might have auto-logged in
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');
    try {
      const data = await AuthSphere.resendVerification(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 p-6">
      <div className="w-full max-w-[450px]">
        <Card className="p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-zinc-100 rounded-full text-zinc-900">
              <KeyRound size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
          <p className="text-sm text-zinc-500 mb-8">
            We sent a 6-digit code to <span className="font-medium text-zinc-900">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-md border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-md flex items-center gap-2 text-green-600 text-xs font-medium justify-center">
                <CheckCircle2 size={14} />
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading} disabled={otp.some(d => !d)}>Verify</Button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 text-sm">
            <p className="text-zinc-500">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-zinc-900 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend'}
              </button>
            </p>
            <button onClick={() => navigate('/login')} className="mt-4 text-zinc-500 hover:text-zinc-900 transition-colors">
              Back to Sign In
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Dashboard ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(AuthSphere.getUser());

  useEffect(() => {
    if (!AuthSphere.isAuthenticated()) navigate('/login');
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 w-full border-b bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-zinc-900 p-1.5 rounded-md text-white">
              <Shield size={18} />
            </div>
            AuthSphere
          </div>
          <Button variant="ghost" size="sm" onClick={() => { AuthSphere.logout(); navigate('/login'); }} icon={LogOut}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome, {user.username.split(' ')[0]}!</h2>
              <p className="text-zinc-500">Your secure session is active.</p>
            </div>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                {user.picture ? (
                  <img src={user.picture} alt="" className="w-16 h-16 rounded-full border border-zinc-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xl font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{user.username}</h3>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Provider</p>
                  <p className="font-medium text-zinc-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Verification</p>
                  <p className="font-medium text-zinc-900 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Email Verified
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Resources</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-zinc-500 mt-0.5" />
                  <p className="text-zinc-600">The full documentation has been moved to the main dashboard.</p>
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm" asChild>
                  <a href="http://localhost:5173/docs" target="_blank" rel="noopener noreferrer">
                    Open Official Docs <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Root ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}