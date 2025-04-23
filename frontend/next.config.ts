// frontend/next.config.ts
import withNextIntl from 'next-intl/plugin';
import type {NextConfig} from 'next';
import type {RemotePattern} from 'next/dist/shared/lib/image-config';

const withIntl = withNextIntl('./i18n/config.ts');

const remotePatterns: RemotePattern[] = [
  {
    protocol: 'https',
    hostname: 'picsum.photos',
    pathname: '/**'
  }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns
  },
  webpack(config) {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
  transpilePackages: ['gray-matter']
};

export default withIntl(nextConfig);
