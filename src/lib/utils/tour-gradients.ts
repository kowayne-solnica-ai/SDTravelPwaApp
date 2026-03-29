/**
 * Gradient backgrounds per tour keyword (fallback when no hero image).
 */
export function getTourGradient(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("sahara") || t.includes("desert"))
    return "from-amber-600 via-orange-700 to-red-800"
  if (t.includes("cockpit") || t.includes("country") || t.includes("jungle"))
    return "from-emerald-500 via-green-700 to-teal-800"
  if (t.includes("ocean") || t.includes("beach") || t.includes("coast") || t.includes("island"))
    return "from-sky-500 via-blue-600 to-indigo-800"
  if (t.includes("mountain") || t.includes("peak") || t.includes("alpine"))
    return "from-slate-500 via-gray-700 to-zinc-800"
  if (t.includes("city") || t.includes("urban") || t.includes("metro"))
    return "from-violet-500 via-purple-700 to-fuchsia-800"
  if (t.includes("safari") || t.includes("wild"))
    return "from-yellow-600 via-amber-700 to-orange-800"
  return "from-sand via-gold to-sand-600"
}
