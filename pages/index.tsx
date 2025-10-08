import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">WotKal - Open Stats</h1>
          <nav className="space-x-4">
            <Link href="/players">Players</Link>
            <Link href="/matches">Matches</Link>
            <Link href="/guides">Guides</Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-4">Live match overlays, player stats, and more</h2>
        <p className="text-gray-300">This is an open-source reimplementation inspired by popular WoT companion sites.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-4 rounded" >
            <Link href="/players">
              <h3 className="font-bold">Player Search</h3>
              <p className="text-sm text-gray-400">Search players by nickname and view stats, vehicles, and recent battles.</p>
            </Link>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <Link href="/matches">
              <h3 className="font-bold">Live Overlays</h3>
              <p className="text-sm text-gray-400">Generate simple overlay images for live streams showing match info.</p>
            </Link>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <Link href="/guides">
              <h3 className="font-bold">Guides & Tips</h3>
              <p className="text-sm text-gray-400">Community-written guides and vehicle builds.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
