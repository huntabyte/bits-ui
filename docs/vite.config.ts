import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
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
