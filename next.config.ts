/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // Optional based on your Next.js version
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com', // ✅ Allow Cloudinary images
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',    // ✅ Optional: Allow Unsplash (if needed)
      },
    ],
    domains: ['dcr9w09mx.cloudinary.com'], // ✅ Replace with your actual Cloudinary domain if needed
  },
};

export default nextConfig;
