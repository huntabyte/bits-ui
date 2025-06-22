import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import { mdsxConfig } from "./mdsx.config.js";
import { execSync } from "node:child_process";

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
		prerender: {
			handleHttpError: ({ path, message }) => {
				// ignore deliberate link to shiny 404 page
				if (path.includes("llms.txt")) return;

				// otherwise fail the build
				throw new Error(message);
			},
		},
		typescript: {
			config: (config) => ({
				...config,
				include: [
					...config.include,
					"../src/**/*.md",
					"../.velite/**/*",
					"../mdsx.config.js",
					"../svelte.config.js",
					"../other/**/*.js",
					"../other/**/*.ts",
				],
			}),
		},
		version: {
			name: execSync("git rev-parse HEAD").toString().trim(),
		},
	},
};

export default config;
