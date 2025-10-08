import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCache, setCache } from '../../../lib/cache'

const APP_ID = process.env.WG_APP_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cacheKey = 'tanks:all'
  const cached = getCache(cacheKey)
  if (cached) return res.status(200).json(cached)

  try {
    const url = `https://api.worldoftanks.com/wot/encyclopedia/tanks/?application_id=${APP_ID}&language=en`
    const r = await axios.get(url)
    const d = r.data.data || {}

    const meta: Record<string, any> = {}
    Object.entries(d).forEach(([k, v]) => {
      const item: any = v
      meta[k] = {
        tank_id: item.tank_id,
        name: item.name || item.short_name || null,
        short_name: item.short_name || null,
        tier: item.tier,
        nation: item.nation,
        type: item.type,
        images: item.images || null,
      }
    })

    setCache(cacheKey, meta, 24 * 60 * 60 * 1000) // cache 24h
    return res.status(200).json(meta)
  } catch (err: any) {
    console.error(err?.toString())
    return res.status(500).json({ error: 'upstream error' })
  }
}
