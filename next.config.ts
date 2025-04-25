/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains or specify your image domains
      },
    ],
  },
  experimental: {
    serverActions: {}, // ✅ Must be an object, not boolean
  },
};

export default nextConfig;
