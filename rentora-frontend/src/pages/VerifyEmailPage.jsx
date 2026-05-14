import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/axiosConfig';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/shared/Logo';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error | sent
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');
    if (!token) {
      // If we don't have a token, we might have just registered
      setStatus('sent');
      return;
    }
    verifyEmail(token);
  }, []);

  const verifyEmail = async (token) => {
    try {
      const response = await API.get(`/auth/verify-email?token=${token}`);
      const data = response.data;

      if (data.token) {
        loginUser(data.token, data.role);
      }
      setStatus('success');

      setTimeout(() => {
        if (data.role === 'TENANT') {
          navigate('/tenant/dashboard');
        } else if (data.role === 'OWNER') {
          navigate('/owner/dashboard');
        } else {
          navigate('/properties');
        }
      }, 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-rentora-ivory flex items-center justify-center p-6 font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 max-w-md w-full text-center shadow-rentora-lg border border-rentora-border relative overflow-hidden"
      >
        {/* Subtle Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rentora-green/10 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rentora-gold/10 blur-[80px]" />

        <div className="flex justify-center mb-10 relative z-10">
          <Logo size={48} className="scale-110" />
        </div>

        <AnimatePresence mode="wait">
          {status === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="w-16 h-16 bg-rentora-green-tint rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-rentora-green" />
              </div>
              <h2 className="text-2xl font-bold text-rentora-ink mb-3">Check your inbox</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed mb-8">
                We've sent a verification link to your email address. Please click it to activate your account.
              </p>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-rentora-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rentora-green-mid shadow-lg hover:shadow-rentora-green/20 transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          )}

          {status === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="relative mb-6">
                <Loader2 className="w-12 h-12 text-rentora-green animate-spin" />
                <div className="absolute inset-0 border-4 border-rentora-green/10 rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold text-rentora-ink mb-3">Verifying Address</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed max-w-[280px]">
                We're confirming your email to secure your account. Just a moment.
              </p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="w-16 h-16 bg-rentora-green-tint rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-rentora-green" />
              </div>
              <h2 className="text-2xl font-bold text-rentora-ink mb-3">Email Verified</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed mb-8">
                Your account is now active. Redirecting you to your workspace.
              </p>
              
              <div className="w-full h-1.5 bg-rentora-green-tint rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-rentora-green shadow-[0_0_8px_rgba(30,77,43,0.4)]"
                />
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-rentora-ink mb-3">Link Expired</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed mb-8">
                This verification link is invalid or has expired. Please try registering again.
              </p>
              
              <button
                onClick={() => navigate('/register')}
                className="w-full py-4 bg-rentora-green text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rentora-green-mid shadow-lg hover:shadow-rentora-green/20 transition-all group"
              >
                Back to Register
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

};

export default VerifyEmailPage;