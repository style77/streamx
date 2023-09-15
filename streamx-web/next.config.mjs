/** @type {import('next').NextConfig} */
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})


const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['localhost', 'ui-avatars.com'],
  },
}

export default nextConfig
