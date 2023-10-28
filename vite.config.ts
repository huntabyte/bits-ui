/// <reference types="vitest" />
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "url";

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		// jest like globals
		globals: true,
		environment: "jsdom",
		// in-source testing
		includeSource: ["src/**/*.{js,ts,svelte}"],
		// Add @testing-library/jest-dom's matchers & mocks of SvelteKit modules
		setupFiles: ["./other/setupTest.ts"],
		coverage: {
			exclude: ["setupTest.ts"]
		},
		alias: [{ find: /^svelte$/, replacement: "svelte/internal" }]
	},
	assetsInclude: ["**/*.md"],
	server: {
		fs: {
			strict: false
		}
	},
	resolve: {
		alias: [
			{
				find: "contentlayer/generated",
				replacement: fileURLToPath(new URL("./.contentlayer/generated", import.meta.url))
			}
		]
	}
});
