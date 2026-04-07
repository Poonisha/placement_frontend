import { Building2, MapPin, Send } from 'lucide-react'

export default function JobCard({
  job,
  onApply,
  applying,
  showApply = true,
  alreadyApplied = false,
}) {
  const title = job.title ?? job.jobTitle ?? 'Untitled role'
  const company = job.companyName ?? job.company ?? 'Company'
  const description = job.description ?? ''

  return (
    <article className="app-card flex flex-col p-5 transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]">
      <div className="mb-3 min-w-0">
        <h3 className="text-base font-semibold text-[var(--color-app-text)]">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-app-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.5} aria-hidden />
            {company}
          </span>
          {job.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.5} aria-hidden />
              {job.location}
            </span>
          ) : null}
        </div>
      </div>
      <p
        className={`line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-app-muted)] ${showApply ? 'mb-5' : 'mb-0'}`}
      >
        {description || 'No description provided.'}
      </p>
      {showApply ? (
        <button
          type="button"
          disabled={applying || alreadyApplied}
          onClick={() => onApply(job)}
          className={`mt-auto w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
            alreadyApplied
              ? 'cursor-not-allowed border border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-muted)]'
              : 'btn-primary'
          }`}
        >
          <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          {alreadyApplied ? 'Applied' : applying ? 'Applying…' : 'Apply'}
        </button>
      ) : null}
    </article>
  )
}
