import path from "node:path";
import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const libPath = path.resolve(dirname, "../packages/bits-ui/src/lib");

// The bench app compiles bits-ui straight from source so library edits are
// picked up by a plain `vite build` with no intermediate `svelte-package` step.
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: [
			{ find: /^bits-ui$/, replacement: path.join(libPath, "index.ts") },
			{ find: /^\$lib/, replacement: libPath },
		],
		dedupe: ["svelte"],
	},
	build: {
		target: "es2022",
	},
});
