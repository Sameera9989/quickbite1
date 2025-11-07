import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2">
      <Search size={18} className="text-zinc-500" />
      <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key==='Enter' && onSearch(q)} placeholder="Search restaurants or cuisines" className="flex-1 bg-transparent outline-none" />
      <button onClick={() => onSearch(q)} className="px-3 py-1.5 rounded bg-primary text-white">Search</button>
    </div>
  )
}
