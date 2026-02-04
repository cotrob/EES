import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    industry: z.string().optional(),
    pubDate: z.coerce.date(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    results: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const offers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/offers' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string().optional(),
    features: z.array(z.string()).default([]),
    ctaText: z.string().default('Get Started'),
    ctaLink: z.string().default('/contact'),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, caseStudies, offers };
