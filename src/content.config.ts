import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    meta_title: z.string(),
    meta_description: z.string(),
    keywords: z.array(z.string()),
    date_debut: z.string(),
    date_fin: z.string(),
    heure_debut: z.string().nullable(),
    heure_fin: z.string().nullable(),
    lieu: z.string(),
    ville: z.string(),
    code_postal: z.string(),
    prix: z.string().nullable(),
    source_url: z.string().url(),
    needs_human_review: z.boolean(),
    publishedAt: z.string(),
    categorie: z.string().nullable()
  })
});

export const collections = { articles };