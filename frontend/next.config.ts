// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  webpack(config: any) {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
  transpilePackages: ['gray-matter'],
  
  // Add rewrites for development to proxy API requests to the backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to Backend (Corrected Port)
      },
    ]
  },
};

module.exports = nextConfig;
