import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Allows any path from this domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',//addcloudinary
        port: '',
        pathname: '/**', // Allows any path from this domain
      },
     
    ],
  },
};

export default nextConfig;
