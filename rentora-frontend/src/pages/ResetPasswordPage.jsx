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
    <div style={{
      minHeight: '100vh',
      background: '#F8F5EE',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reset-card { animation: fadeUp 0.5s ease forwards; }
        .input-field {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid rgba(30,77,43,0.15);
          border-radius: 12px; outline: none;
          font-size: 14px; color: #141A14;
          background: white; transition: border 0.2s;
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #4A8C5C;
          box-shadow: 0 0 0 3px rgba(74,140,92,0.1);
        }
      `}</style>

      <div
        className="reset-card"
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '420px', width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(30,77,43,0.10)',
          border: '1px solid rgba(30,77,43,0.08)'
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <RentoraLogo size={44}/>
        </div>

        {!token ? (
          <>
            <div style={{
              width: '72px', height: '72px',
              background: '#FEE2E2',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px'
            }}>⚠️</div>
            <h2 style={{
              fontSize: '22px', fontWeight: 700,
              color: '#141A14', marginBottom: '8px'
            }}>
              Invalid Link
            </h2>
            <p style={{
              fontSize: '14px', color: '#6B7A6B',
              marginBottom: '28px'
            }}>
              This reset link is invalid.
              Please request a new one.
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              style={{
                width: '100%', padding: '14px',
                background: '#1E4D2B', color: 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Request New Link
            </button>
          </>
        ) : success ? (
          <>
            <div style={{
              width: '72px', height: '72px',
              background: '#EAF2EC',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="36" height="36"
                   viewBox="0 0 36 36" fill="none">
                <path d="M8 18L15 25L28 11"
                  stroke="#1E4D2B" strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '22px', fontWeight: 700,
              color: '#141A14', marginBottom: '8px'
            }}>
              Password Reset! ✅
            </h2>
            <p style={{
              fontSize: '14px', color: '#6B7A6B',
              lineHeight: 1.6
            }}>
              Your password has been updated.
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <h2 style={{
              fontSize: '22px', fontWeight: 700,
              color: '#141A14', marginBottom: '8px'
            }}>
              Reset Password 🔐
            </h2>
            <p style={{
              fontSize: '14px', color: '#6B7A6B',
              lineHeight: 1.6, marginBottom: '32px'
            }}>
              Enter your new password below.
            </p>

            {error && (
              <div style={{
                background: '#FEE2E2',
                color: '#991B1B',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'left'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{
                marginBottom: '16px', textAlign: 'left'
              }}>
                <label style={{
                  fontSize: '11px', fontWeight: 600,
                  color: '#6B7A6B', letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block', marginBottom: '8px'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Min. 6 characters"
                  value={formData.newPassword}
                  onChange={e => setFormData({
                    ...formData,
                    newPassword: e.target.value
                  })}
                  required
                />
              </div>

              <div style={{
                marginBottom: '24px', textAlign: 'left'
              }}>
                <label style={{
                  fontSize: '11px', fontWeight: 600,
                  color: '#6B7A6B', letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block', marginBottom: '8px'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading
                    ? '#ccc' : '#1E4D2B',
                  color: 'white', border: 'none',
                  borderRadius: '12px', fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading
                    ? 'not-allowed' : 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.22s',
                  marginBottom: '20px'
                }}
              >
                {loading
                  ? 'Resetting...'
                  : 'Reset Password'}
              </button>
            </form>

            <Link to="/login" style={{
              fontSize: '13px', color: '#6B7A6B',
              textDecoration: 'none'
            }}>
              ← Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage