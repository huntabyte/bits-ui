import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import { mdsxConfig } from "./mdsx.config.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsx(mdsxConfig), vitePreprocess()],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),
		alias: {
			"$icons/*": "src/lib/components/icons/*",
			"$content/*": ".velite/*",
		},
	},
};

export default config;
