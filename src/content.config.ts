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
    author: z.string(),
    week: z.number().optional(),
    title: z.string(),
    tags: z.array(z.string()).optional().default([]),
    summary: z.string().optional(),
  }),
});

const analysis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/analysis' }),
  schema: z.object({
    week: z.number(),
    date: z.string(),
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
    joined: z.string(),
    last_updated: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    maker: z.string(),
    title: z.string(),
    description: z.string().optional(),
    link: z.string().url().optional(),
    tags: z.array(z.string()).optional().default([]),
    week: z.number().optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { missions, insights, analysis, members, gallery };
