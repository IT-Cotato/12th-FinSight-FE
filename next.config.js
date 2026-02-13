/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgnews.pstatic.net', // 기존 도메인
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net', // 이번에 새로 에러 난 도메인 추가!
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig