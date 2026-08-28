import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.string().optional(),
  }),
});

// Blog content money — bài SEO/GEO viết theo góc nhìn MONA (TIEU-CHUAN-CONTENT-MONEY). slug = tên file.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),                 // dd/mm/yyyy
    updated: z.string().optional(),
    keyword: z.string(),              // keyword chính (đã research)
    category: z.enum(['huong-dan', 'so-sanh', 'chuyen-mona', 'kien-thuc']),
    h1: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { docs, posts };
