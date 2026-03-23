import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/employee/', '/account/'],
    },
    sitemap: 'https://vigroup.cz/sitemap.xml',
  }
}
