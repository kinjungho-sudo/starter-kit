import { defineCollection, z } from 'astro:content';

const missions = defineCollection({
  type: 'content',
  schema: z.object({
    week: z.number().optional(),
    member: z.string().optional(),
    title: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    maker: z.string().optional(),
    link: z.string().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).optional(),
    created: z.coerce.string().optional(),
    description: z.string().optional(),
    type: z.enum(['vanilla', 'external', 'ppt']).optional().default('vanilla'),
    agents: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
  }),
});

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    summary: z.string().optional(),
    source: z.string().optional(),
    created: z.coerce.string().optional(),
    expires: z.coerce.string().optional(),
    type: z.enum(['url', 'thought']).optional(),
    author: z.string().optional(),
    week: z.number().optional(),
  }),
});

const analysis = defineCollection({
  type: 'content',
  schema: z.object({
    week: z.number().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    total_submissions: z.number().optional(),
  }),
});

const members = defineCollection({
  type: 'content',
  schema: z.object({
    nickname: z.string().optional(),
    github: z.string().optional(),
    role: z.string().optional(),
    joined: z.string().optional(),
    last_updated: z.string().optional(),
  }),
});

const proposals = defineCollection({
  type: 'content',
  schema: z.object({
    tags: z.array(z.string()).optional(),
    last_updated: z.string().optional(),
    count: z.number().optional(),
    preview: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  }),
});

export const collections = {
  missions,
  gallery,
  insights,
  analysis,
  members,
  proposals,
};
