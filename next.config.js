/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hydration警告を抑制
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // 開発環境でのhydration警告を抑制
  reactStrictMode: false,
}

module.exports = nextConfig
