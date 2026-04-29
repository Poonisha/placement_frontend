import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { USER_STORAGE_KEY } from '../services/api.js'

const LOGIN_BG_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'

export default function Login({ title, subtitle }) {
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

    const email = form.email.trim()   // 🔥 IMPORTANT FIX
    const password = form.password

    const baseURL = import.meta.env.VITE_API_BASE_URL
    const loginUrl = `${baseURL}/api/auth/login`

    try {
      console.log("Sending:", { email, password })

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('LOGIN RESPONSE:', data)

      if (!response.ok || !data.success) {
        const msg = data?.message || 'Login failed'
        setError(msg)
        toast.error(msg)
        return
      }

      const user = data.user

      if (!user || !user.role) {
        setError('Invalid server response')
        return
      }

      // ✅ SAVE USER
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem("token", data.token)
      setUser(user)

      toast.success('Login successful')

      // 🔥 ROLE BASED ROUTING (FINAL)
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard')
          break
        case 'STUDENT':
          navigate('/dashboard')
          break
        case 'EMPLOYER':
          navigate('/employer/dashboard')
          break
        case 'PLACEMENT_OFFICER':
          navigate('/po/dashboard')
          break
        default:
          navigate('/')
      }

    } catch (err) {
      console.error('LOGIN ERROR:', err)

      const msg = err.message || 'Login failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LOGIN_BG_IMAGE})` }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-6">{subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border-b p-2 outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border-b p-2 outline-none"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <Link to="/" className="block text-center mt-4 text-sm text-gray-500">
            Back to home
          </Link>

        </div>
      </div>
    </div>
  )
}