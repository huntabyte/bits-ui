// this is gonna be real ugly until I am satisfied with the output and ready to clean it up
import { promises as fs, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { tmpdir } from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import docsPackageJson from "../package.json" with { type: "json" };
import bitsPackageJson from "../../packages/bits-ui/package.json" with { type: "json" };

const execPromise = promisify(exec);

const __DIRNAME = dirname(fileURLToPath(import.meta.url));

const INPUT_DEMOS_DIR = join(__DIRNAME, "../src/lib/components/demos");
const OUTPUT_STACKBLITZ_PATH = join(
	__DIRNAME,
	"../src/routes/api/demos.json/stackblitz-files.json"
);
const OUTPUT_DEMO_JSON_PATH = join(__DIRNAME, "../src/routes/api/demos.json/demos.json");

const CSS_CONTENT = readFileSync(join(__DIRNAME, "../src/lib/styles/app.css"), "utf-8")
	.split("\n")
	// remove imports and plugins from the CSS contents since this gets pushed into the HTML
	.filter((line) => !line.startsWith("@import") && !line.startsWith("@plugin"))
	.join("\n");

export const APP_HTML_TEMPLATE = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link
			href="https://bits-ui.com/favicon-light.svg"
			rel="icon"
			media="(prefers-color-scheme: light)"
		/>
		<link
			href="https://bits-ui.com/favicon-dark.svg"
			rel="icon"
			media="(prefers-color-scheme: dark)"
		/>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!-- Tailwind v4 does not support Web Containers, so we do this -->
		<script src="https://unpkg.com/@tailwindcss/browser@4"></script>
		<style type="text/tailwindcss">
			${CSS_CONTENT}
		</style>
		%sveltekit.head%
	</head>

	<body
		data-sveltekit-preload-data="hover"
		class="bg-background overflow-y-auto font-sans antialiased"
	>
		<div>%sveltekit.body%</div>
	</body>
</html>
`;

// ideally we extract these on a per demo basis, but for now this will do
const BITS_DEPS = [
	"bits-ui",
	"@internationalized/date",
	"phosphor-svelte",
	"clsx",
	"tailwind-merge",
];

const libFiles = {
	"src/lib/utils/styles.ts": readFileSync(join(__DIRNAME, "../src/lib/utils/styles.ts"), "utf8"),
	"src/routes/+layout.svelte": readFileSync(
		join(__DIRNAME, "../src/lib/components/stackblitz-demo-layout.svelte"),
		"utf8"
	),
};

const IGNORE_LIST = ["node_modules", ".svelte-kit", "static"];

/**
 * Recursively collects file information from a directory and its subdirectories.
 *
 * @param currentDir - The current directory to traverse.
 * @param baseDir - The project root directory for calculating relative paths.
 */
async function collectFiles(currentDir: string, baseDir: string): Promise<Record<string, string>> {
	const entries = await fs.readdir(currentDir, { withFileTypes: true });
	const files: Record<string, string> = {};

	for (const entry of entries) {
		const fullPath = join(currentDir, entry.name);

		if (entry.isDirectory()) {
			if (IGNORE_LIST.includes(entry.name)) continue;
			const subFiles = await collectFiles(fullPath, baseDir);
			Object.assign(files, subFiles);
		} else if (entry.isFile()) {
			const relPath = relative(baseDir, fullPath);
			let content = await fs.readFile(fullPath, "utf-8");
			if (IGNORE_LIST.includes(relPath)) continue;

			if (relPath === "src/app.html") {
				content = APP_HTML_TEMPLATE;
			}

			files[relPath] = content;
		}
	}

	return files;
}

/**
 * Removes a directory and all its contents recursively.
 * @param dirPath - The directory to remove.
 */
async function removeDir(dirPath: string): Promise<void> {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dirPath, entry.name);
		if (entry.isDirectory()) {
			await removeDir(fullPath);
		} else {
			await fs.unlink(fullPath);
		}
	}
	await fs.rmdir(dirPath);
}

/**
 * Builds a JSON file with the demo components.
 */
async function buildDemoRegistry() {
	const files = await fs.readdir(INPUT_DEMOS_DIR);

	const components: Record<string, string> = {};
	for (const file of files) {
		const name = file.replace(".svelte", "");
		const content = await fs.readFile(join(INPUT_DEMOS_DIR, file), "utf-8");
		components[name] = content.replaceAll(/src="\/([^"]*)"/g, 'src="https://bits-ui.com/$1"');
	}

	const jsonOutput = JSON.stringify(components);
	await fs.mkdir(dirname(OUTPUT_DEMO_JSON_PATH), { recursive: true });
	await fs.writeFile(OUTPUT_DEMO_JSON_PATH, jsonOutput, "utf-8");
}

/**
 * Creates a Svelte project using the `sv` CLI.
 *
 * We use this so we don't need to maintain a separate Svelte project template,
 * and let `sv` do the work for us.
 *
 * @returns - The path to the created project directory.
 */
async function createSvelteProject(): Promise<string> {
	const uniqueDirName = `svelte-project-${Date.now()}`;
	const projectDir = join(tmpdir(), uniqueDirName);
	await fs.mkdir(projectDir, { recursive: true });
	const command =
		"pnpx sv@latest create . --template=minimal --types=ts --no-add-ons --no-install";
	await execPromise(command, { cwd: projectDir });
	return projectDir;
}

async function buildBaseStackBlitzFiles(files: Record<string, string>) {
	// extract deps
	const packageJson = JSON.parse(files["package.json"]);
	for (const dep of BITS_DEPS) {
		if (dep === "bits-ui") {
			packageJson.devDependencies["bits-ui"] = bitsPackageJson.version;
			continue;
		}

		// @ts-expect-error shh
		const docsDep = docsPackageJson.devDependencies[dep];

		packageJson.devDependencies[dep] = docsDep;
	}

	packageJson.scripts["start"] = "vite";

	const outputFiles = {
		...files,
		"package.json": JSON.stringify(packageJson, null, 2),
		...libFiles,
	};
	const jsonOutput = JSON.stringify(outputFiles);
	await fs.mkdir(dirname(OUTPUT_STACKBLITZ_PATH), { recursive: true });
	await fs.writeFile(OUTPUT_STACKBLITZ_PATH, jsonOutput, "utf-8");
}

/**
 * Main function to create a Svelte project, collect its file information,
 * extract dependencies, and clean up.
 */
async function main(): Promise<void> {
	let projectDir = "";

	try {
		projectDir = await createSvelteProject();
		const files = await collectFiles(projectDir, projectDir);
		await buildBaseStackBlitzFiles(files);
	} catch (error) {
		if (error instanceof Error) {
			console.error("An error occurred:", error.message);
		} else if (error && typeof error === "object" && "stderr" in error) {
			console.error("Error details:", error.stderr);
		}
		process.exit(1);
	} finally {
		// clean up the temp dir
		if (projectDir) {
			try {
				await removeDir(projectDir);
			} catch (cleanupError) {
				if (cleanupError instanceof Error) {
					console.error("Failed to clean up temporary directory:", cleanupError.message);
				}
			}
		}
	}

	try {
		await buildDemoRegistry();
	} catch (err) {
		console.error(err);
	}
}

main();
