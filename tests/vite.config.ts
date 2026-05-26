import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";

const vitestBrowserConditionPlugin: Plugin = {
	name: "vite-plugin-vitest-browser-condition",
	// @ts-expect-error - idk
	config({ resolve }: { resolve?: { conditions: string[] } }) {
		if (process.env.VITEST) {
			if (resolve?.conditions) {
				resolve.conditions.unshift("browser");
			} else {
				// @ts-expect-error - idk
				resolve.conditions = ["browser"];
			}
		}
	},
};

export default defineConfig({
	// @ts-expect-error - vite v8 / vitest v3 (vite v7) type mismatch in plugins
	plugins: [tailwindcss(), vitestBrowserConditionPlugin, sveltekit()],
	optimizeDeps: {
		// svelte-toolbelt ships .svelte.js source files that must be compiled by
		// vite-plugin-svelte. Exclude it from esbuild pre-bundling so Svelte runes
		// ($derived, $state, etc.) are not served raw and undefined at runtime.
		exclude: ["svelte-toolbelt"],
	},
	test: {
		poolOptions: {
			forks: {
				maxForks: 7,
			},
		},
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "browser",
					include: ["src/tests/**/*.browser.test.ts"],
					includeSource: ["src/tests/**/*.{js,ts,svelte}"],
					setupFiles: ["./other/setup-browser-test.ts"],
					environment: "browser",
					testTimeout: 5000,
					retry: 3,
					browser: {
						enabled: true,
						headless: true,
						provider: "playwright",
						isolate: true,
						instances: [{ browser: "chromium" }, { browser: "webkit" }],
					},
				},
			},
		],
	},
});
