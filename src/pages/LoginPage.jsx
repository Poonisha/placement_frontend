import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { api, USER_STORAGE_KEY } from '../services/api.js'

/** Office / workspace — Unsplash (free to use with attribution in demo docs). */
const LOGIN_BG_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'

function loginErrorMessage(err) {
  const res = err.response
  if (!res) return err.message || 'Login failed. Please try again.'
  const d = res.data
  if (typeof d === 'string') return d
  if (d && typeof d === 'object') {
    const combined =
      d.message ||
      d.error ||
      (Array.isArray(d.errors) ? d.errors.filter(Boolean).join(', ') : null)
    if (combined) return String(combined)
  }
  if (res.status === 401 && res.statusText) return res.statusText
  return 'Login failed. Please try again.'
}

function extractUserFromLoginResponse(data) {
  if (!data || typeof data !== 'object') return null
  if (data.user && typeof data.user === 'object') return data.user
  if (data.role != null || data.email != null || data.id != null) return data
  return null
}

export default function LoginPage({ title, subtitle }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      console.log(form)
      const { data } = await api.post('/api/auth/login', form)
      if (data?.success === false) {
        const msg = data?.message || 'Login failed. Please try again.'
        setError(String(msg))
        toast.error(String(msg))
        return
      }
      const user = extractUserFromLoginResponse(data)
      if (!user || typeof user !== 'object') {
        const msg = 'Invalid login response from server.'
        setError(msg)
        toast.error(msg)
        return
      }
      if (user.role == null && user.email == null && user.id == null) {
        const msg = 'Invalid login response — missing user fields.'
        setError(msg)
        toast.error(msg)
        return
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      setUser(user)
      toast.success('Signed in successfully.')
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true })
      } else if (user.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true })
      } else if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard', { replace: true })
      } else if (user.role === 'PLACEMENT_OFFICER') {
        navigate('/po/dashboard', { replace: true })
      } else {
        alert('Unknown role')
      }
    } catch (err) {
      const msg = loginErrorMessage(err)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleClick() {
    toast('Single sign-on is not configured for this deployment.')
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh]">
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOGIN_BG_IMAGE})` }}
        aria-hidden
      />
      {/* Dark overlay + frosted readability layer */}
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950/55 backdrop-blur-[6px]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden />

      {/* Top bar */}
      <header className="relative z-20 px-4 pt-5 sm:px-6 sm:pt-6">
        <Link
          to="/"
          className="inline-flex text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white"
        >
          ← Back to PlaceConnect
        </Link>
      </header>

      {/* Centered card */}
      <div className="relative z-10 flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8">
        <div
          className="w-full max-w-[420px] rounded-2xl border border-stone-200/90 bg-[#faf9f6] p-8 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:p-10"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          <div className="text-center sm:text-left">
            <p className="font-['Poppins',sans-serif] text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              {title}
            </p>
            <h1 className="mt-3 font-['Poppins',sans-serif] text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.65rem]">
              Login
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{subtitle}</p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-7">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border-0 border-b border-stone-300 bg-transparent py-2.5 text-sm text-stone-900 caret-stone-800 transition duration-200 placeholder:text-stone-400 focus:border-stone-800 focus:outline-none focus:ring-0"
                placeholder="you@organization.com"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full border-0 border-b border-stone-300 bg-transparent py-2.5 text-sm text-stone-900 caret-stone-800 transition duration-200 placeholder:text-stone-400 focus:border-stone-800 focus:outline-none focus:ring-0"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p
                className="rounded-lg border border-stone-200 bg-stone-100/80 px-3 py-2.5 text-sm text-stone-800 transition-opacity duration-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase tracking-wide">
              <span className="bg-[#faf9f6] px-3 text-stone-400">or</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white/80 py-3 text-sm font-medium text-stone-700 shadow-sm transition duration-200 hover:border-stone-400 hover:bg-white"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-600"
                aria-hidden
              >
                G
              </span>
              Continue with Google
            </button>
            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-xl border border-stone-300 bg-transparent py-3 text-center text-sm font-medium text-stone-700 transition duration-200 hover:border-stone-400 hover:bg-stone-50"
            >
              Sign up
            </Link>
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-stone-500">
            Need access? Return home to pick your portal or contact your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
