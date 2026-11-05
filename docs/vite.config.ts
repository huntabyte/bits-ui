import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import { mdsxConfig } from "./mdsx.config.js";
import { execSync } from "node:child_process";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: [mdsx(mdsxConfig), vitePreprocess()],
			extensions: [".svelte", ".md"],
			compilerOptions: {
				warningFilter: (w) => {
					if (w.code === "state_referenced_locally") return false;

					return true;
				},
			},
			adapter: adapter(),
			prerender: {
				handleHttpError: ({ path, message }) => {
					// ignore deliberate link to shiny 404 page
					if (path.includes("llms.txt")) return;

					// otherwise fail the build
					throw new Error(message);
				},
			},
			version: { name: execSync("git rev-parse HEAD").toString().trim() },
		}),
		devtoolsJson(),
	],
	assetsInclude: ["**/*.md"],
	environments: { ssr: { build: { rolldownOptions: { platform: "browser" } } } },
	server: { fs: { strict: false } },
	optimizeDeps: { exclude: ["bits-ui"] },
	resolve: { noExternal: true },
});
