import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCache, setCache } from '../../../lib/cache'

const APP_ID = process.env.WG_APP_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const nickname = Array.isArray(req.query.nickname) ? req.query.nickname[0] : req.query.nickname
  if (!nickname) return res.status(400).json({ error: 'nickname required' })

  const cacheKey = `search:${nickname}`
  const cached = getCache(cacheKey)
  if (cached) return res.status(200).json(cached)

  try {
    const url = `https://api.worldoftanks.eu/wot/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(nickname)}`
    const r = await axios.get(url)
    const data = r.data.data || []
    setCache(cacheKey, data, 30_000)
    return res.status(200).json(data)
  } catch (err: any) {
    console.error(err?.toString())
    return res.status(500).json({ error: 'upstream error' })
  }
}
