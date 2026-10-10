import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Every collection below is edited by adding / changing JSON files only. See MAINTENANCE.md.
// Files whose name starts with "_" are examples and are ignored.

const site = defineCollection({
  loader: file('src/content/site.json'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    roles: z.array(z.string()),
    about: z.array(z.string()),
    contact: z.object({ note: z.string().default(''), email: z.string().default(''), instagram: z.string().default('') }),
    footerNote: z.string().default(''),
    hero: z.object({ gallery: z.string(), file: z.string() }),
  }),
});

const films = defineCollection({
  loader: glob({ base: './src/content/films', pattern: ['*.json', '!_*'] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number(),
      role: z.string(),
      youtubeId: z.string().default(''),
      poster: image(),
      logline: z.string().default(''),
      description: z.array(z.string()).default([]),
      credits: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      runtime: z.string().default(''),
      order: z.number().default(99),
      published: z.boolean().default(true),
    }),
});

const galleries = defineCollection({
  loader: glob({ base: './src/content/galleries', pattern: '*/gallery.json', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().default(''),
      year: z.string().default(''),
      location: z.string().default(''),
      order: z.number().default(99),
      cover: image().optional(),
      videos: z.array(z.object({ src: z.string(), poster: z.string().default(''), caption: z.string().default('') })).default([]),
      published: z.boolean().default(true),
    }),
});

const awards = defineCollection({
  loader: glob({ base: './src/content/awards', pattern: '*.json' }),
  schema: ({ image }) =>
    z.object({
    title: z.string(),
    category: z.string().default(''),
    festival: z.string(),
    location: z.string().default(''),
    date: z.string(), // "YYYY" or "YYYY-MM"; used for sorting
    work: z.string().default(''), // film id, e.g. "anna-s-diary"
    role: z.string().default(''),
    url: z.string().default(''),
    image: image().optional(), // certificate / laurel, shown on the film page
    published: z.boolean().default(true),
  }),
});

const press = defineCollection({
  loader: glob({ base: './src/content/press', pattern: '*.json' }),
  schema: z.object({
    outlet: z.string(),
    title: z.string(),
    date: z.string(),
    url: z.string().default(''),
    excerpt: z.string().default(''),
    published: z.boolean().default(true),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ base: './src/content/exhibitions', pattern: '*.json' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    location: z.string().default(''),
    date: z.string(),
    role: z.string().default(''),
    description: z.string().default(''),
    url: z.string().default(''),
    published: z.boolean().default(true),
  }),
});

export const collections = { site, films, galleries, awards, press, exhibitions };
