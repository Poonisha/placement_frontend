export function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.users)) return data.users
  if (Array.isArray(data?.jobs)) return data.jobs
  return []
}
