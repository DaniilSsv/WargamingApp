import { useState } from 'react'
import Link from 'next/link'

export default function Players() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<any>(null)

  async function doSearch(query: string) {
    if (!query) return
    setLoading(true)
    setError(null)
    try {
      console.log('doSearch', query)
      const res = await fetch(`/api/wg/search?nickname=${encodeURIComponent(query)}`)
      setLastResponse({ status: res.status, ok: res.ok })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      const data = await res.json()
      setResults(data || [])
      setLastResponse(data)

    } catch (err: any) {
      console.error('search error', err)
      setError(err?.message || 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doSearch(query.trim())
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-4">Player Search</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="nickname"
          className="p-2 bg-gray-800 rounded flex-1"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              doSearch(query.trim())
            }
          }}
          placeholder="Enter nickname"
          aria-label="Player nickname"
        />
        <button
          className="bg-red-600 px-4 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
          onClick={() => doSearch(query.trim())}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div aria-live="polite" className="sr-only">{loading ? 'Searching' : error ? `Error: ${error}` : ''}</div>

      <div className="mt-6 space-y-2">
        {error && <div className="text-red-400">Error: {error}</div>}

        {!loading && !error && results.length === 0 && (
          <div className="text-gray-400">No results yet. Enter a nickname and press Enter or click Search.</div>
        )}

        {results.map((r) => (
          <Link 
          key={r.account_id}
          href={`/players/${r.account_id}`}
          className="block bg-gray-800 p-3 rounded hover:bg-gray-700"
          >
            <div className="font-semibold">{r.nickname}</div>
            <div className="text-sm text-gray-400">id: {r.account_id}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
