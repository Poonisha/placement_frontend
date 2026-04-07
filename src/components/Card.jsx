export default function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  )
}
