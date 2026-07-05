import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		warningFilter: (w) => {
			if (w.code === "state_referenced_locally") return false;
			return true;
		},
	},
};

export default config;
