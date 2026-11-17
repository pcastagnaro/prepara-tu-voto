import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { SCHEMAS } from './lib/schemas';

// Un `defineCollection` por colección (literal) para conservar el tipo exacto de cada esquema.
const loader = (dir: string) => glob({ pattern: '**/*.yaml', base: `./data/${dir}` });

export const collections = {
  parties: defineCollection({ loader: loader('parties'), schema: SCHEMAS.parties }),
  people: defineCollection({ loader: loader('people'), schema: SCHEMAS.people }),
  topics: defineCollection({ loader: loader('topics'), schema: SCHEMAS.topics }),
  constituencies: defineCollection({ loader: loader('constituencies'), schema: SCHEMAS.constituencies }),
  sources: defineCollection({ loader: loader('sources'), schema: SCHEMAS.sources }),
  appearances: defineCollection({ loader: loader('appearances'), schema: SCHEMAS.appearances }),
  claims: defineCollection({ loader: loader('claims'), schema: SCHEMAS.claims }),
  timeline: defineCollection({ loader: loader('timeline'), schema: SCHEMAS.timeline }),
};
