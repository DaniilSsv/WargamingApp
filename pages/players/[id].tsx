import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function PlayerDetail() {
  const router = useRouter()
  const { id } = router.query

  const [info, setInfo] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [tanksMeta, setTanksMeta] = useState<Record<string, any> | null>(null)
  const [recent, setRecent] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    async function load() {
      const [pRaw, rRaw, tanksRaw] = await Promise.all([
        fetch(`/api/wg/player?id=${id}`).then(r => r.json()),
        fetch(`/api/wg/recent?id=${id}`).then(r => r.json()),
        fetch(`/api/wg/tanks`).then(r => r.json()),
      ])

      const p = pRaw as any
      const r = rRaw as any
      const tanks = tanksRaw as Record<string, any>

      setInfo(p.info ? Object.values(p.info)[0] as any : null)
      setVehicles(p.vehicles ? Object.values(p.vehicles)[0] as any[] : [])
      setTanksMeta(tanks || null)
      setRecent(r)
    }

    load()
  }, [id])

  if (!id) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button onClick={() => router.back()} className="mb-4 text-sm text-gray-300">← Back</button>
      <div className="p-6 text-white">Loading...</div>
    </div>
  ) 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button onClick={() => router.back()} className="mb-4 text-sm text-gray-300">← Back</button>
      <h1 className="text-2xl font-bold mb-2">{info?.nickname || `Player ${id}`}</h1>
      <div className="text-gray-400 mb-4">Account ID: {id}</div>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div>Clan: {info?.clan?.tag || '—'}</div>
          <div>Created: {info?.created_at ? new Date(info.created_at * 1000).toLocaleDateString() : '—'}</div>
          <div>Last battle time: {info?.last_battle_time ? new Date(info.last_battle_time * 1000).toLocaleString() : '—'}</div>
        </div>

        <div className="md:col-span-2 bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Top Vehicles</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-300">Showing top {vehicles?.length ? Math.min(6, vehicles.length) : 0} vehicles</div>
            <div className="flex gap-2">
              <label className="text-sm text-gray-400">Sort:</label>
              <select id="sort" className="bg-gray-800 rounded px-2 py-1 text-sm" onChange={(e) => {
                const v = e.target.value
                if (v === 'battles') setVehicles(prev => [...prev].sort((a,b) => b.battles - a.battles))
                if (v === 'winrate') setVehicles(prev => [...prev].sort((a,b) => (b.wins/b.battles || 0) - (a.wins/a.battles || 0)))
              }}>
                <option value="battles">Battles</option>
                <option value="winrate">Winrate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicles && vehicles.length ? vehicles.slice(0,6).map((v:any) => {
              const meta = tanksMeta ? tanksMeta[String(v.tank_id)] : null
              const name = meta?.name || meta?.short_name || `Tank ${v.tank_id}`
              const tier = meta?.tier || '—'
              const img = meta?.images?.big_icon || meta?.images?.preview || null
              const winrate = v.battles ? Math.round((v.wins / v.battles) * 100) : 0

              return (
                <div key={v.tank_id} className="bg-gray-700 p-3 rounded flex gap-3 items-center">
                  <div className="w-20 h-14 bg-gray-600 flex-shrink-0 rounded overflow-hidden flex items-center justify-center relative">
                    {img ? (
                      <Image src={img} alt={name} fill style={{ objectFit: 'contain' }} sizes="80px" />
                    ) : (
                      <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="40" rx="4" fill="#1F2937" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="#9CA3AF">No Image</text>
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold"><a href={`/tanks/${v.tank_id}`} className="hover:underline">{name}</a></div>
                      <div className="text-sm text-gray-300">Tier {tier}</div>
                    </div>
                    <div className="text-sm text-gray-300">Battles: {v.battles} • Wins: {v.wins} • Winrate: {winrate}%</div>
                  </div>
                </div>
              )
            }) : <div className="text-gray-400">No vehicle stats available.</div>}
          </div>
        </div>
      </section>

      <section className="mt-6 bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">Recent (achievements/data)</h3>
        <pre className="text-sm text-gray-300 max-h-64 overflow-auto">{JSON.stringify(recent, null, 2)}</pre>
      </section>
    </div>
  )
}
