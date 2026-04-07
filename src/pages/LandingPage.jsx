import { Link } from 'react-router-dom'
import { GraduationCap, Shield, UserCog, Building2 } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const portals = [
  {
    to: '/student-login',
    title: 'Student',
    description: 'Browse openings and apply to roles.',
    icon: GraduationCap,
  },
  {
    to: '/employer-login',
    title: 'Employer',
    description: 'Publish opportunities and reach candidates.',
    icon: Building2,
  },
  {
    to: '/admin-login',
    title: 'Admin',
    description: 'Manage users and platform access.',
    icon: Shield,
  },
  {
    to: '/officer-login',
    title: 'Placement Officer',
    description: 'Review applications and support placements.',
    icon: UserCog,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-app-bg)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-app-text)] sm:text-4xl">
            PlaceConnect
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-app-muted)]">
            Placement management for students, employers, administrators, and officers — minimal,
            secure, and ready to pair with your Spring Boot API.
          </p>
        </div>
        <h2 className="mt-14 text-xs font-semibold uppercase tracking-wider text-[var(--color-app-muted)]">
          Sign in by role
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="app-card group flex flex-col p-5 transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-text)]">
                <p.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-app-text)]">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-app-muted)]">
                {p.description}
              </p>
              <span className="mt-4 text-sm font-medium text-[var(--color-app-text)]">Continue →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
