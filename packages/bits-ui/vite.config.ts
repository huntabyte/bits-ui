import process from "node:process";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";

const vitestBrowserConditionPlugin: Plugin = {
	name: "vite-plugin-vitest-browser-condition",
	// client environment only, so `// @vitest-environment node` tests can render with `svelte/server`
	configEnvironment(name, config) {
		if (process.env.VITEST && name === "client") {
			config.resolve ??= {};
			config.resolve.conditions = ["browser", ...(config.resolve.conditions ?? [])];
		}
	},
};

export default defineConfig({
	plugins: [vitestBrowserConditionPlugin, sveltekit({ preprocess: [vitePreprocess()] })],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		// jest like globals
		globals: true,
		environment: "jsdom",
		// in-source testing
		includeSource: ["src/**/*.{js,ts,svelte}"],
	},
});
