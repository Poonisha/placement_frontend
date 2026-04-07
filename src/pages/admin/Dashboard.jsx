import { useEffect, useState } from 'react'
import { Users, Building2, Briefcase, Database } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api.js'
import AdminCard from '../../components/admin/Card.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get('/api/admin/stats')
        setStats(data ?? {})
      } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Could not load dashboard statistics.'
        toast.error(String(msg))
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      delta: stats?.totalUsersGrowth ?? '+4.2% this month',
    },
    {
      title: 'Registered Companies',
      value: stats?.registeredCompanies ?? 0,
      icon: Building2,
      delta: stats?.registeredCompaniesGrowth ?? '+2.1% this month',
    },
    {
      title: 'Placement Records',
      value: stats?.placementRecords ?? 0,
      icon: Database,
      delta: stats?.placementRecordsGrowth ?? '+3.8% this month',
    },
    {
      title: 'Active Job Listings',
      value: stats?.activeJobListings ?? 0,
      icon: Briefcase,
      delta: stats?.activeJobListingsGrowth ?? '+5.5% this month',
    },
  ]

  const recentActivity = Array.isArray(stats?.recentActivity) ? stats.recentActivity : []

  return (
    <>
      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <AdminCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                delta={card.delta}
              />
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-app-border)] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <h2 className="text-base font-semibold text-[var(--color-app-text)]">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No recent activity"
                    description="System activity appears here when users and employers interact with placements."
                  />
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentActivity.map((item, idx) => (
                    <li
                      key={`${item?.id ?? idx}`}
                      className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-3 py-2.5 text-sm text-[var(--color-app-text)]"
                    >
                      {item?.message ?? String(item)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-[var(--color-app-border)] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <h2 className="text-base font-semibold text-[var(--color-app-text)]">Quick Actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button className="btn-secondary w-full justify-start">Add New User</button>
                <button className="btn-secondary w-full justify-start">Review Placements</button>
                <button className="btn-secondary w-full justify-start">Export Reports</button>
                <button className="btn-secondary w-full justify-start">Audit Logs</button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
