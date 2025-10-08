/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // common Wargaming/CDN hosts used by tank images; add more if needed
    domains: [
      'static.worldoftanks.eu',
      'static.wargaming.net',
      'cdn2.wargaming.net',
      'tanks.gg',
      'images.weserv.nl'
    ],
  },
}

export default nextConfig
