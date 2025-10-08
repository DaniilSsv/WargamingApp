import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function TankDetail() {
  const router = useRouter()
  const { id } = router.query
  const [meta, setMeta] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetch('/api/wg/tanks').then(r => r.json()).then((d) => {
      setMeta(d[String(id)])
    })
  }, [id])

  if (!id) return <div className="p-6 text-white">Loading...</div>

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <button onClick={() => router.back()} className="mb-4 text-sm text-gray-300">← Back</button>
      <h1 className="text-2xl font-bold mb-2">{meta?.name || `Tank ${id}`}</h1>
      <div className="text-gray-400 mb-4">Tier: {meta?.tier || '—'} • Nation: {meta?.nation || '—'} • Type: {meta?.type || '—'}</div>

      <div className="bg-gray-800 p-4 rounded flex gap-4">
        <div className="w-48 h-32 relative bg-gray-700 rounded overflow-hidden">
          {meta?.images?.big_icon ? (
            <Image src={meta.images.big_icon} alt={meta.name} fill style={{ objectFit: 'contain' }} sizes="192px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Short name</h3>
          <div className="text-gray-300">{meta?.short_name || '—'}</div>
        </div>
      </div>
    </div>
  )
}
