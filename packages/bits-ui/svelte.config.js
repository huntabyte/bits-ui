// @ts-check
import { preprocessMeltUI } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), preprocessMeltUI()],
};

export default config;
