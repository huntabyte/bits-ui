import { preprocessMeltUI } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import sequence from "svelte-sequential-preprocessor";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [sequence([vitePreprocess(), preprocessMeltUI()])],
};

export default config;
