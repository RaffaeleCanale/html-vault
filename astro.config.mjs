import svelte from '@astrojs/svelte';
import singleFile from 'astro-single-file';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), singleFile()],
});
