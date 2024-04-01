import path from "node:path";
import url from "node:url";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import { mdsxConfig } from "./mdsx.config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsx(mdsxConfig), vitePreprocess({
		style: {
			css: {
				postcss: path.join(__dirname, "postcss.config.cjs"),
			},
		},
	}),],
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),
		alias: {
			"$lib/*": "src/lib/*",
			"$icons/*": "src/lib/components/icons/*",
			"contentlayer/generated": ".contentlayer/generated",
		},
	},
};

export default config;
