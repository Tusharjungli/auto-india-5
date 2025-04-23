/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // ✅ Newer feature (if using form actions)
  },
  images: {
    domains: ['yourdomain.com', 'images.unsplash.com'], // ✅ Add other sources if needed
  },
};

export default nextConfig;
