import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const missions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/missions' }),
  schema: z.object({
    member: z.string(),
    week: z.number(),
    title: z.string(),
    date: z.string().optional(),
    url: z.string().url().optional(),
    stack: z.array(z.string()).optional().default([]),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().optional(),
    author: z.union([z.string(), z.array(z.any()), z.null()]).optional(),
    week: z.number().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    keywords: z.array(z.string()).optional().default([]),
    summary: z.string().optional(),
    source: z.string().optional(),
    created: z.coerce.string().optional(),
    expires: z.coerce.string().optional(),
    published: z.coerce.string().optional(),
    description: z.string().optional(),
    type: z.enum(['url', 'thought']).optional(),
  }),
});

const analysis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/analysis' }),
  schema: z.object({
    week: z.number(),
    date: z.coerce.string(),
    tags: z.array(z.string()).optional().default([]),
    total_submissions: z.number().optional(),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: z.object({
    nickname: z.string(),
    github: z.string(),
    role: z.string(),
    joined: z.coerce.string(),
    last_updated: z.coerce.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string().optional(),
    maker: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    week: z.number().optional(),
    thumbnail: z.string().optional(),
    created: z.coerce.string().optional(),
    type: z.enum(['vanilla', 'external', 'ppt']).optional().default('vanilla'),
  }),
});

export const collections = { missions, insights, analysis, members, gallery };
