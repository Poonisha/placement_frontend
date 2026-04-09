import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const REGISTER_URL = 'http://localhost:8080/api/auth/register'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.email.trim()) err.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email.trim())) err.email = 'Enter a valid email address'
    if (!form.password) err.password = 'Password is required'
    else if (form.password.length < 4) err.password = 'Password must be at least 4 characters'
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }
      const { data } = await axios.post(REGISTER_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (data?.success === false) {
        setSubmitError(String(data?.message ?? 'Registration failed'))
        return
      }
      navigate('/login', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        (typeof err.response?.data === 'string' ? err.response.data : null) ??
        err.message ??
        'Registration failed'
      setSubmitError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)]">
      <Navbar />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-text)]"
          >
            ← Back
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-[var(--color-app-text)]">Create account</h1>
          <p className="mt-2 text-sm text-[var(--color-app-muted)]">Register with your campus or employer email.</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-card)] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="app-input"
                autoComplete="name"
                required
              />
              {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="app-input"
                autoComplete="email"
                required
              />
              {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="app-input"
                autoComplete="new-password"
                required
              />
              {fieldErrors.password ? <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="app-input">
                <option value="STUDENT">Student</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {submitError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {submitError}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Creating account…
                </>
              ) : (
                'Register'
              )}
            </button>
            <p className="text-center text-sm text-[var(--color-app-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--color-app-text)] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
