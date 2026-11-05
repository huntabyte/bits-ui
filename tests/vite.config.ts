import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const srcLib = fileURLToPath(new URL("../packages/bits-ui/src/lib", import.meta.url));

/**
 * Resolves `bits-ui` (and its internal `#lib/*` imports) to source at `lib` instead of `dist`.
 * SvelteKit's `$lib` alias runs first and points at this package's `src/lib`, so undo that
 * for imports coming from inside `lib`. Tests that import a `dist` module by path (to spy on
 * a state class) get the matching source module, so they see the instances components use.
 */
const testsLib = fileURLToPath(new URL("./src/lib/", import.meta.url));
const dist = fileURLToPath(new URL("../packages/bits-ui/dist/", import.meta.url));
function bitsUiSource(lib: string): Plugin {
	return {
		name: "bits-ui-source",
		enforce: "pre",
		resolveId(id, importer) {
			if (id === "bits-ui") return `${lib}/index.ts`;
			if (importer && id.startsWith(".")) {
				const path = resolve(dirname(importer), id);
				if (path.startsWith(dist)) {
					return `${lib}/${path.slice(dist.length).replace(/\.js$/, ".ts")}`;
				}
			}
			if (!importer?.startsWith(lib)) return;
			// `#lib/*` is the package's subpath import; `$lib/*` is kept for older baseline snapshots
			const rest =
				id.startsWith("#lib/") || id.startsWith("$lib/")
					? id.slice(5)
					: id.startsWith(testsLib)
						? id.slice(testsLib.length)
						: null;
			if (rest !== null) return this.resolve(`${lib}/${rest}`, importer, { skipSelf: true });
		},
	};
}

// `BENCH_SRC=baseline` benches the pristine snapshot made by `pnpm bench:snapshot`.
const benchLib = fileURLToPath(
	new URL(
		process.env.BENCH_SRC === "baseline"
			? "../packages/bits-ui/.bench-baseline/lib"
			: "../packages/bits-ui/src/lib",
		import.meta.url
	)
);

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
	plugins: [
		tailwindcss(),
		vitestBrowserConditionPlugin,
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: vitePreprocess(),

			compilerOptions: {
				warningFilter: (w) => {
					if (w.code === "state_referenced_locally") return false;

					return true;
				},
			},
		}),
	],
	test: {
		maxWorkers: 7,
		projects: [
			{
				// `BITS_UI_SRC=1` tests bits-ui source directly instead of the built `dist`.
				plugins: process.env.BITS_UI_SRC ? [bitsUiSource(srcLib)] : [],
				test: {
					name: "browser",
					isolate: true,
					include: ["src/tests/**/*.browser.test.ts"],
					includeSource: ["src/tests/**/*.{js,ts,svelte}"],
					setupFiles: ["./other/setup-browser-test.ts"],
					testTimeout: 5000,
					retry: 3,
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: "chromium" }, { browser: "webkit" }],
					},
				},
			},
			{
				// Perf benchmarks against bits-ui *source* in production mode. See bench/README.md.
				// Vitest 5 projects inherit the root config by default; the root `sveltekit()` would
				// compile Svelte a second time, in dev mode.
				extends: false,
				plugins: [bitsUiSource(benchLib), svelte({ compilerOptions: { dev: false } })],
				resolve: {
					conditions: ["browser", "production", "module", "import", "default"],
				},
				define: {
					__BENCH_LABEL__: JSON.stringify(process.env.BENCH_LABEL ?? "current"),
					__BENCH_RUNS__: Number(process.env.BENCH_RUNS ?? 20),
				},
				mode: "production",
				test: {
					name: "bench",
					include: ["bench/**/*.bench.test.ts"],
					testTimeout: 600_000,
					hookTimeout: 60_000,
					retry: 0,
					fileParallelism: false,
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({
							launchOptions: {
								args: ["--js-flags=--expose-gc", "--enable-precise-memory-info"],
							},
						}),
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
