import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Khai báo config trước
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },

      // THÊM DÒNG NÀY CHO BACKBLAZE B2
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
        pathname: '/**',
      },
    ],
  },

  typescript: {
    // Cho phép production build kể cả khi TS errors
    ignoreBuildErrors: true,
  },
}

// Wrap bằng next-intl plugin
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
