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
  transpilePackages: ['gray-matter']
};

module.exports = nextConfig;
