import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { preprocessMeltUI } from "@melt-ui/pp";
import sequence from "svelte-sequential-preprocessor";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [sequence([vitePreprocess(), preprocessMeltUI()]), vitePreprocess({})],

	kit: {
		adapter: adapter(),
		alias: {
			$lib: "src/lib",
			"$lib/*": "src/lib/*",
			$internal: "src/lib/internal",
			"$internal/*": "src/lib/internal/*",
			"@/": "src/lib",
			"@/*": "src/lib/*"
		}
	}
};

export default config;
