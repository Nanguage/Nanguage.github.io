import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Link-out entry: shows in lists but has no local page.
    // May be an absolute URL or a site-relative path (/examples/…, /slides/…).
    jump: z.string().optional(),
    math: z.boolean().default(false),
  }),
});

export const collections = { blog };
