const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgnews.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)