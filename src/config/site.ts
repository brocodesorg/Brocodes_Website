export const siteConfig = {
  name: 'BroCodes',
  title: 'BroCodes — Creative Software Projects',
  description: 'A curated collection of creative, interactive, and useful software projects.',

  // Hero section
  hero: {
    heading: 'Creative Software Projects',
    description: 'Explore, learn from, and download real software projects.',
  },

  // Optional sections - leave empty to hide
  about: '',
  contact: {
    email: '',
    github: '',
    twitter: '',
    linkedin: '',
  },

  // SEO and social
  url: process.env.PUBLIC_SITE_URL || 'https://example.com',
  ogImage: '/logo.jpg', // 3D Robot Mascot & BroCodes 3D Logo

  // Projects per page
  projectsPerPage: 12,
} as const;
