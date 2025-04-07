// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config: any) {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
  transpilePackages: ['gray-matter']
};

module.exports = nextConfig;
