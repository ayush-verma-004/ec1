import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.jpeg';
import { 
  Eye, EyeOff, X, CheckCircle2, Circle, Sprout, 
  Briefcase, FileCheck, Building2, Leaf, Shield, 
  Globe, Zap, ArrowRight 
} from 'lucide-react';

import { clearSession, isTokenExpired, setSession } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('SIGN_IN'); // 'SIGN_IN', 'SIGN_UP', 'OTP'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-econe-dark/80 backdrop-blur-md" onClick={onClose} />
        
        {/* Modal Container */}
        <motion.div
          layoutId="auth-modal"
          className="relative w-full max-w-2xl bg-white sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-screen sm:min-h-0"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT: Brand Side (Hidden on Mobile) */}
          <BrandSide view={view} />

          {/* RIGHT: Form Side */}
          <div className="flex-1 relative flex flex-col justify-center p-5 sm:p-7 bg-white overflow-y-auto">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {view === 'SIGN_IN' && (
                <SignInView key="sign-in" setView={setView} email={email} setEmail={setEmail} onClose={onClose} loading={loading} setLoading={setLoading} />
              )}
              {view === 'SIGN_UP' && (
                <SignUpView key="sign-up" setView={setView} email={email} setEmail={setEmail} loading={loading} setLoading={setLoading} />
              )}
              {view === 'OTP' && (
                <OtpView key="otp" setView={setView} email={email} onClose={onClose} loading={loading} setLoading={setLoading} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* --- Sub Components --- */

const BrandSide = ({ view }) => {
  return (
    <div className="hidden md:flex md:w-[35%] brand-card-bg relative flex-col justify-between p-6 text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-econe-emerald/20 rounded-full blur-[80px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-econe-emerald/10 rounded-full blur-[80px] animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden shadow-sm">
            <img src={logo} alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">EosCarbon</span>
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold leading-tight mb-3 font-heading">
            {view === 'SIGN_IN' ? "Powering the Carbon Economy." : "Join the Future of Trading."}
          </h2>
          <p className="text-white/60 text-[11px] leading-relaxed mb-4">
            {view === 'SIGN_IN' 
              ? "Access the world's first high-integrity marketplace for verified carbon hasehs." 
              : "Register as a verifier, buyer, or generator and start making a global impact."}
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Shield className="text-econe-emerald w-4 h-4 mb-1" />
          <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Security</div>
          <div className="text-[10px] font-semibold">Verified</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Globe className="text-econe-emerald w-4 h-4 mb-1" />
          <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Global</div>
          <div className="text-[10px] font-semibold">120+ Markets</div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, type = "text", ...props }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === 'password';

  return (
    <div className="relative mb-3 group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-econe-emerald transition-colors">
        {Icon && <Icon size={16} />}
      </div>
      <input
        type={isPwd && showPwd ? 'text' : type}
        className="block w-full pl-6 pr-8 py-2 text-econe-dark bg-transparent border-0 border-b border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-econe-emerald peer transition-all text-sm"
        placeholder=" "
        {...props}
      />
      <label className="absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 left-6 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-econe-emerald group-focus-within:left-6 text-sm">
        {label}
      </label>
      {isPwd && (
        <button
          type="button"
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-econe-emerald"
        >
          {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

const SignInView = ({ setView, email, setEmail, onClose, loading, setLoading }) => {
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const password = e.target.elements[1].value;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, role, email: userEmail } = response.data;
      
      setSession(accessToken, role, userEmail);
      toast.success('Login successful!');
      onClose();
      
      // Navigate based on role
      const routes = {
        FARMER: '/farmer',
        BUSINESSMAN: '/biz',
        NGO: '/ngo',
        GOVERNMENT: '/gov'
      };
      navigate(routes[role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-econe-dark mb-1 font-heading tracking-tight">Welcome Back</h2>
        <p className="text-gray-400 text-xs font-medium">Please sign in to continue.</p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-6">
        <InputField 
          label="Email Address" 
          type="email" 
          icon={Globe}
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <InputField 
          label="Password" 
          type="password" 
          icon={Shield}
          required 
        />
        
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 border-2 border-gray-300 rounded accent-econe-emerald" />
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
          </label>
          <button type="button" className="text-sm text-econe-emerald hover:text-econe-hover font-bold transition-colors">
            Forgot password?
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-econe-dark text-white rounded-xl font-bold shadow-xl shadow-econe-dark/10 hover:shadow-econe-dark/20 transition-all flex items-center justify-center gap-2 group text-sm disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-gray-500 text-xs">
          New to EosCarbon?{' '}
          <button onClick={() => setView('SIGN_UP')} className="text-econe-emerald font-bold hover:underline underline-offset-4">
            Create an account
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const SignUpView = ({ setView, email, setEmail, loading, setLoading }) => {
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const rules = {
    length: password.length >= 8,
    digit: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };
  
  const rulesMet = Object.values(rules).filter(Boolean).length;
  const isPwdValid = rulesMet === 5;

  const roles = [
    { id: 'FARMER', label: 'Generator', desc: 'Offsets & Credits', icon: <Sprout size={18} /> },
    { id: 'BUSINESSMAN', label: 'Buyer', desc: 'Secure Purchases', icon: <Building2 size={18} /> },
    { id: 'NGO', label: 'Verifier', desc: 'Integrity Check', icon: <FileCheck size={18} /> },
    { id: 'GOVERNMENT', label: 'Regulator', desc: 'Policy & Audit', icon: <Briefcase size={18} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPwdValid && role && email) {
      setLoading(true);
      try {
        await api.post('/auth/register', { email, password, role });
        toast.success('Registration successful! Please check your email for OTP.');
        setView('OTP');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-econe-dark mb-0.5 font-heading tracking-tight">Create Account</h2>
        <p className="text-gray-400 text-[11px] font-medium leading-tight">Join the next-gen carbon ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-1">
          <InputField label="Email Address" type="email" icon={Globe} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <InputField label="Password" type="password" icon={Zap} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {/* Password Strength Meter */}
        {password.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5 pt-0 mb-1.5"
          >
            <div className="flex gap-1 h-0.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all duration-500 ${
                    i < rulesMet ? 'bg-econe-emerald' : 'bg-gray-100'
                  }`} 
                />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Object.entries({
                '8+': rules.length,
                '123': rules.digit,
                'abc': rules.lower,
                'ABC': rules.upper,
                '#@$': rules.special,
              }).map(([label, met]) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <div className={`w-0.5 h-0.5 rounded-full ${met ? 'bg-econe-emerald' : 'bg-gray-300'}`} />
                  <span className={`text-[7px] font-bold uppercase ${met ? 'text-econe-dark' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Improved Role Selection */}
        <div className="pt-0.5">
          <label className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Choose Portal</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all duration-300 relative group overflow-hidden ${
                  role === r.id 
                    ? 'border-econe-emerald bg-econe-emerald/5 shadow-md shadow-econe-emerald/10' 
                    : 'border-gray-100/50 hover:border-gray-200 bg-gray-50/30'
                }`}
              >
                {role === r.id && (
                  <motion.div 
                    layoutId="role-active" 
                    className="absolute inset-0 bg-econe-emerald/5 z-0" 
                  />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-7 h-7 rounded-lg mb-1 flex items-center justify-center transition-colors ${
                    role === r.id ? 'bg-econe-emerald text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    {r.icon}
                  </div>
                  <div className={`font-bold text-[10px] ${role === r.id ? 'text-econe-dark' : 'text-gray-600'}`}>
                    {r.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading || !isPwdValid || !role}
          className="w-full py-3 bg-econe-dark text-white rounded-xl font-bold shadow-xl shadow-econe-dark/10 hover:shadow-econe-dark/20 transition-all flex items-center justify-center gap-2 group mt-3 text-sm disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center border-t border-gray-100 pt-4">
        <p className="text-gray-500 text-xs font-medium">
          Already registered?{' '}
          <button onClick={() => setView('SIGN_IN')} className="text-econe-emerald font-bold hover:underline underline-offset-4 transition-all">
            Log in here
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const OtpView = ({ email, setView, loading, setLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) newOtp[i] = pastedData[i] || '';
      setOtp(newOtp);
      const lastFilledIndex = newOtp.findLastIndex(val => val !== '');
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputs.current[focusIndex].focus();
      return;
    }
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1].focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setLoading(true);
      try {
        await api.post('/auth/verify-otp', { email, otp: otpValue });
        toast.success('OTP verified! You can now sign in.');
        setView('SIGN_IN');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid OTP');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-econe-emerald/20 overflow-hidden shadow-md">
        <img src={logo} alt="Logo" className="w-full h-full object-cover scale-110" />
      </div>
      <h2 className="text-4xl font-bold text-econe-dark mb-3 font-heading tracking-tight">Verification Code</h2>
      <p className="text-gray-500 mb-10 font-medium">
        Enter the 6-digit code sent to <br/>
        <span className="font-bold text-econe-dark">{email || 'your email'}</span>
      </p>

      <form onSubmit={handleVerify}>
        <div className="flex justify-center gap-3 mb-10">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputs.current[idx] = el}
              type="text"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold text-econe-dark bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-econe-emerald focus:bg-white transition-all outline-none"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading || otp.some(v => v === '')}
          className="w-full py-4 bg-econe-dark text-white rounded-2xl font-bold shadow-xl shadow-econe-dark/10 hover:shadow-econe-dark/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' }}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Verify & Continue'
          )}
        </motion.button>
      </form>

      <div className="mt-10 text-gray-400 text-sm font-bold">
        Didn&apos;t receive it?{' '}
        <button className="text-econe-emerald hover:text-econe-hover underline underline-offset-4">
          Resend code
        </button>
      </div>
    </motion.div>
  );
};

export default AuthModal;
