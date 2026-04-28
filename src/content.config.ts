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
    type: z.enum(['url', 'thought', 'quote', 'video']).optional(),
    book: z.string().optional(),
    platform: z.string().optional(),
    youtube_id: z.string().optional(),
    has_transcript: z.boolean().optional(),
  }),
});

const quotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quotes' }),
  schema: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    book: z.string().optional(),
    platform: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    created: z.coerce.string().optional(),
    source: z.string().optional(),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    title: z.string().optional(),
    channel: z.string().optional(),
    youtube_id: z.string().optional(),
    url: z.string().optional(),
    has_transcript: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional(),
    created: z.coerce.string().optional(),
    summary: z.string().optional(),
  }),
});

const analysis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/analysis' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    finished: z.coerce.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
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

export const collections = { missions, insights, quotes, videos, analysis, members, gallery };
