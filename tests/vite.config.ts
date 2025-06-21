/// <reference types="@vitest/browser/providers/playwright" />

import process from "node:process";
import { svelte } from "@sveltejs/vite-plugin-svelte";
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
				plugins: [vitestBrowserConditionPlugin, svelte(), svelteTesting()],
				test: {
					name: "browser",
					include: ["src/tests/**/*.browser.{svelte.test,test}.ts"],
					setupFiles: ["./other/setup-browser-test.ts"],
					environment: "browser",
					retry: 3,
					browser: {
						enabled: true,
						headless: true,
						provider: "playwright",
						isolate: true,
						// providerOptions: { context: { actionTimeout: 25_000 } },
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
