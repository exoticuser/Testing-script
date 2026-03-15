/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'ia.media-imdb.com' },
      { protocol: 'https', hostname: 'imdb-api.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
}
module.exports = nextConfig
