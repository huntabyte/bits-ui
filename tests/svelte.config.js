import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		warningFilter: (w) => {
			if (w.code === "state_referenced_locally") return false;
			return true;
		},
	},
	vitePlugin: {
		// svelte-toolbelt ships .svelte.js files with uncompiled Svelte runes.
		// Include them explicitly so vite-plugin-svelte compiles them even though
		// they live in node_modules (excluded by default in vite 8).
		include: [/node_modules\/svelte-toolbelt/],
	},
};

export default config;
