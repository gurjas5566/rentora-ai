import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import API from '../services/axiosConfig'

const RentoraLogo = ({ size = 36 }) => (
  <svg width={size} height={size}
       viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="9" fill="#1E4D2B"/>
    <path d="M6 17L16 7L26 17" stroke="#F8F5EE"
          strokeWidth="2.2" strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M9 17V25H14V20H18V25H23V17"
          stroke="#F8F5EE" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="25" cy="8" r="3" fill="#B8962E"/>
  </svg>
)

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !==
        formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (formData.newPassword.length < 6) {
      setError(
        'Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    try {
      await API.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data ||
        'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-rentora-ivory font-poppins flex items-center justify-center p-6">
      <div className="animate-fade-up bg-white rounded-[24px] p-10 md:p-12 max-w-[420px] w-full text-center shadow-rentora-md border border-rentora-border">
        <div className="flex justify-center mb-6">
          <RentoraLogo size={44}/>
        </div>

        {!token ? (
          <>
            <div className="w-[72px] h-[72px] bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              ⚠️
            </div>
            <h2 className="text-[22px] font-bold text-rentora-ink mb-2">
              Invalid Link
            </h2>
            <p className="text-sm text-rentora-ink-muted mb-7">
              This reset link is invalid. Please request a new one.
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full py-3.5 bg-rentora-green text-white rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-rentora-green-mid transition-all"
            >
              Request New Link
            </button>
          </>
        ) : success ? (
          <>
            <div className="w-[72px] h-[72px] bg-rentora-green-tint rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18L15 25L28 11" stroke="#1E4D2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-[22px] font-bold text-rentora-ink mb-2">
              Password Reset! ✅
            </h2>
            <p className="text-sm text-rentora-ink-muted leading-relaxed">
              Your password has been updated. Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[22px] font-bold text-rentora-ink mb-2">
              Reset Password 🔐
            </h2>
            <p className="text-sm text-rentora-ink-muted leading-relaxed mb-8">
              Enter your new password below.
            </p>

            {error && (
              <div className="bg-red-100 text-red-800 p-3 px-4 rounded-xl text-[13px] mb-4 text-left border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="text-[11px] font-bold text-rentora-ink-muted tracking-wider uppercase block mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full p-3.5 border border-rentora-border rounded-xl outline-none text-sm text-rentora-ink bg-white transition-all focus:border-rentora-green-soft focus:ring-4 focus:ring-rentora-green/5"
                  placeholder="Min. 6 characters"
                  value={formData.newPassword}
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="text-left mb-6">
                <label className="text-[11px] font-bold text-rentora-ink-muted tracking-wider uppercase block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-3.5 border border-rentora-border rounded-xl outline-none text-sm text-rentora-ink bg-white transition-all focus:border-rentora-green-soft focus:ring-4 focus:ring-rentora-green/5"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-white rounded-xl text-[15px] font-semibold transition-all mb-5 ${
                  loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-rentora-green hover:bg-rentora-green-mid hover:shadow-rentora-sm active:scale-[0.98]'
                }`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" className="text-[13px] text-rentora-ink-muted hover:text-rentora-green transition-colors no-underline">
              ← Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage