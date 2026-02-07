import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // Example disallowed paths
    },
    sitemap: 'https://interview-recorder.vercel.app/sitemap.xml',
  };
}
