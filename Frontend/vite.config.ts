import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';

export default defineConfig({
  plugins: [svelte(), json(), scss()]
});
