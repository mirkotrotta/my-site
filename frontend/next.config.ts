// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
        destination: 'http://api:8000/api/:path*', // Use Docker service name instead of localhost
      },
    ]
  },
  // Configure fetch options to follow redirects
  serverRuntimeConfig: {
    fetchOptions: {
      redirect: 'follow',
    },
  },
  // This ensures that the client also follows redirects
  publicRuntimeConfig: {
    fetchOptions: {
      redirect: 'follow',
    },
  },
};

module.exports = nextConfig;
