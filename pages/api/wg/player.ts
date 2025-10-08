import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getCache, setCache } from '../../../lib/cache'

const APP_ID = process.env.WG_APP_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accountId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!accountId) return res.status(400).json({ error: 'id required' })

  const cacheKey = `player:${accountId}`
  const cached = getCache(cacheKey)
  if (cached) return res.status(200).json(cached)

  try {
    const infoUrl = `https://api.worldoftanks.eu/wot/account/info/?application_id=${APP_ID}&account_id=${accountId}`
    const vehiclesUrl = `https://api.worldoftanks.eu/wot/tanks/stats/?application_id=${APP_ID}&account_id=${accountId}`

    const [infoR, vehiclesR] = await Promise.all([axios.get(infoUrl), axios.get(vehiclesUrl)])
    const data = { info: infoR.data.data, vehicles: vehiclesR.data.data }
    setCache(cacheKey, data, 60_000)
    return res.status(200).json(data)
  } catch (err: any) {
    console.error(err?.toString())
    return res.status(500).json({ error: 'upstream error' })
  }
}
