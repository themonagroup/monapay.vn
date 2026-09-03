import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// howto/faq: optional, dùng để phát JSON-LD HowTo/FAQPage cho trang docs (Docs.astro đọc và render script schema,
// không lặp lại nội dung trong bài — xem cụm dung-ngay/*.md để có ví dụ).
const howtoFaqSchema = {
  howto: z.array(z.object({ name: z.string(), text: z.string() })).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
};

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.string().optional(),
    ...howtoFaqSchema,
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

// English docs — cùng slug với docs tiếng Việt, đặt tại src/content/docs-en/**
const docs_en = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs-en' }),
  schema: z.object({ title: z.string(), description: z.string(), updated: z.string().optional(), ...howtoFaqSchema }),
});

export const collections = { docs, posts, docs_en };
