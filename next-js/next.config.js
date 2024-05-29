/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  env: {
    SOCKET: process.env.SOCKET,
    BACKEND_HOST: process.env.BACKEND_HOST,
  }
}
