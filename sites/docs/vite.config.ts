import { URL, fileURLToPath } from "node:url";
import { sveltekit } from "@sveltejs/kit/vite";
import { type Plugin, defineConfig } from "vite";
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [
		sveltekit(),
		// visualizer({
		// 	emitFile: true,
		// 	filename: "stats.html",
		// }) as Plugin,
	],
	assetsInclude: ["**/*.md"],
	server: {
		fs: {
			strict: false,
		},
	},
	optimizeDeps: {
		exclude: ["bits-ui"],
	},
	resolve: {
		alias: [
			{
				find: "contentlayer/generated",
				replacement: fileURLToPath(new URL("./.contentlayer/generated", import.meta.url)),
			},
		],
	},
});
