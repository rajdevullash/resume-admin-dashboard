/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  },
}

module.exports = nextConfig
