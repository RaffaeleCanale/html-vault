import singleFile from 'astro-single-file';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    integrations: [singleFile()],
    vite: {
        build: {
            minify: true,
        },
    },
});
