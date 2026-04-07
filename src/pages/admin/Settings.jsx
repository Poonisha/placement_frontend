import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('PlaceConnect')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [placementAlerts, setPlacementAlerts] = useState(true)

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Settings saved successfully.')
  }

  const handleBackup = () => {
    toast.success('Backup started. You will be notified when complete.')
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-xl border border-[var(--color-app-border)] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
    >
        <section>
          <h2 className="text-base font-semibold text-[var(--color-app-text)]">Platform Configuration</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Platform Name</label>
              <input
                className="app-input"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-app-text)]">Academic Year</label>
              <select
                className="app-input"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option>2024-2025</option>
                <option>2025-2026</option>
                <option>2026-2027</option>
              </select>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-app-border)] pt-6">
          <h2 className="text-base font-semibold text-[var(--color-app-text)]">Notifications</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-sm text-[var(--color-app-text)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--color-app-border)]"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              Email notifications
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--color-app-text)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--color-app-border)]"
                checked={placementAlerts}
                onChange={(e) => setPlacementAlerts(e.target.checked)}
              />
              Placement alerts
            </label>
          </div>
        </section>

        <section className="border-t border-[var(--color-app-border)] pt-6">
          <h2 className="text-base font-semibold text-[var(--color-app-text)]">Data Backup</h2>
          <p className="mt-2 text-sm text-[var(--color-app-muted)]">Last backup: Today at 02:30 AM</p>
          <button type="button" onClick={handleBackup} className="btn-secondary mt-4">
            Run Backup Now
          </button>
        </section>

        <div className="border-t border-[var(--color-app-border)] pt-6">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
    </form>
  )
}
