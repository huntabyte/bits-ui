import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { preprocessMeltUI } from "@melt-ui/pp";
import sequence from "svelte-sequential-preprocessor";
import { mdsvex } from "@huntabyte/mdsvex";
import { mdsvexOptions } from "./mdsvex.config.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [sequence([mdsvex(mdsvexOptions), vitePreprocess(), preprocessMeltUI()])],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),
		alias: {
			"$lib/*": "src/lib/*",
			"@/*": "src/*",
			"$icons/*": "src/components/icons/*",
			"contentlayer/generated": ".contentlayer/generated",
		},
	},
};

export default config;
