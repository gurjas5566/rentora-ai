import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/axiosConfig'
import Logo from '../components/shared/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-rentora-ivory flex items-center justify-center p-6 font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 max-w-[480px] w-full text-center shadow-rentora-lg border border-rentora-border relative overflow-hidden"
      >
        {/* Subtle Background Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rentora-green/10 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rentora-gold/10 blur-[80px]" />

        <div className="flex justify-center mb-10 relative z-10">
          <button onClick={() => navigate('/')} className="hover:scale-105 transition-transform duration-300">
            <Logo size={48} className="scale-110" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-bold text-rentora-ink mb-3">Forgot Password?</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed mb-10 max-w-[320px] mx-auto">
                No worries! Enter your email below and we'll send you a secure link to reset your password.
              </p>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-2xl text-sm mb-6 text-left flex items-start gap-3"
                >
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-rentora-ink-muted uppercase tracking-[0.15em] mb-2.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rentora-ink-muted/40 group-focus-within:text-rentora-green transition-colors" />
                    <input
                      type="email"
                      className="w-full bg-rentora-green-pale/50 border border-rentora-border focus:border-rentora-green focus:ring-4 focus:ring-rentora-green/5 rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-rentora-ink/20 text-base"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rentora-green text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-rentora-green/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-rentora-ink-muted hover:text-rentora-green transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-rentora-green-tint rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 className="w-10 h-10 text-rentora-green" />
              </div>
              
              <h2 className="text-3xl font-bold text-rentora-ink mb-3">Check your inbox!</h2>
              <p className="text-rentora-ink-muted text-sm leading-relaxed mb-6">
                We've sent a secure reset link to:
              </p>
              
              <div className="bg-rentora-green-tint/50 px-6 py-3 rounded-2xl mb-8 border border-rentora-green/10">
                <span className="font-bold text-rentora-green text-lg">{email}</span>
              </div>

              <p className="text-rentora-ink-muted text-xs mb-10 leading-relaxed max-w-[280px]">
                The link will expire in 1 hour. If you don't see it, please check your spam folder.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={() => setSent(false)}
                  className="w-full py-4 border-2 border-rentora-border-mid text-rentora-green rounded-2xl font-bold text-sm hover:bg-rentora-green-pale transition-colors"
                >
                  Try a different email
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-sm font-bold text-rentora-ink-muted hover:text-rentora-ink transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div >
  )
}

export default ForgotPasswordPage;