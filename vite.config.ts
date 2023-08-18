import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "url";

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"]
	},
	assetsInclude: ["**/*.md", "**/*.mdx"],
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
