import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vite";
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
	plugins: [tailwindcss(), vitestBrowserConditionPlugin, sveltekit(), svelteTesting()],
	test: {
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "jsdom",
					include: ["src/tests/**/*.{test,spec}.{js,ts}"],
					globals: true,
					environment: "jsdom",
					includeSource: ["src/tests/**/*.{js,ts,svelte}"],
					setupFiles: ["./other/setup-test.ts"],
					exclude: ["./other/setup-test.ts"],
					retry: 3,
				},
			},
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
						instances: [
							{ browser: "chromium" },
							{ browser: "firefox" },
							{ browser: "webkit" },
						],
					},
				},
			},
		],
	},
});
