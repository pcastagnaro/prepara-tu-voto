import { defineConfig } from 'astro/config';

// Ajusta `site`/`base` si el repositorio se publica con otro nombre o dominio propio.
export default defineConfig({
  site: 'https://pcastagnaro.github.io',
  base: '/prepara-tu-voto',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
