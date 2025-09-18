import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), visualizer()],
	assetsInclude: ["**/*.md"],
	server: {
		fs: {
			strict: false,
		},
	},
	optimizeDeps: {
		exclude: ["bits-ui"],
	},
	resolve: { noExternal: true },
});
