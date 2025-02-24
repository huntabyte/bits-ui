// this is gonna be real ugly until I am satisfied with the output and ready to clean it up
import { promises as fs, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import docsPackageJson from "../package.json" with { type: "json" };
import bitsPackageJson from "../../packages/bits-ui/package.json" with { type: "json" };
import { tmpdir } from "os";
import { promisify } from "util";
import { exec } from "child_process";
import consola from "consola";

consola.wrapConsole();

const __DIRNAME = dirname(fileURLToPath(import.meta.url));
const resolvePath = (path: string) => join(__DIRNAME, path);
const execPromise = promisify(exec);

const config = {
	paths: {
		inputDemos: "../src/lib/components/demos",
		outputStackblitz: "../src/routes/api/demos.json/stackblitz-files.json",
		outputDemoJson: "../src/routes/api/demos.json/demos.json",
		appCss: "../src/lib/styles/app.css",
		utilsStyles: "../src/lib/utils/styles.ts",
		demoLayout: "../src/lib/components/stackblitz-demo-layout.svelte",
	},
	ignoreList: ["node_modules", ".svelte-kit", "static"],
	bitsDependencies: [
		"bits-ui",
		"@internationalized/date",
		"phosphor-svelte",
		"clsx",
		"tailwind-merge",
	],
	commands: {
		createProject:
			"pnpx sv@latest create . --template=minimal --types=ts --no-add-ons --no-install",
	},
};

type FileMap = Record<string, string>;

function getCssContent(): string {
	return readFileSync(resolvePath(config.paths.appCss), "utf-8")
		.split("\n")
		.filter((line) => !line.startsWith("@import") && !line.startsWith("@plugin"))
		.join("\n");
}

const APP_HTML_TEMPLATE = `<!doctype html>
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
			  ${getCssContent()}
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

async function collectFiles(currentDir: string, baseDir: string): Promise<FileMap> {
	try {
		const entries = await fs.readdir(currentDir, { withFileTypes: true });
		const files: FileMap = {};

		for (const entry of entries) {
			const fullPath = join(currentDir, entry.name);
			const relPath = relative(baseDir, fullPath);

			if (config.ignoreList.includes(entry.name) || config.ignoreList.includes(relPath)) {
				continue;
			}

			if (entry.isDirectory()) {
				const subFiles = await collectFiles(fullPath, baseDir);
				Object.assign(files, subFiles);
			} else if (entry.isFile()) {
				let content = await fs.readFile(fullPath, "utf-8");

				if (relPath === "src/app.html") {
					content = APP_HTML_TEMPLATE;
				}

				files[relPath] = content;
			}
		}

		return files;
	} catch (error) {
		throw new Error(
			`Failed to collect files from ${currentDir}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
	try {
		await fs.mkdir(dirname(path), { recursive: true });
		await fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
		console.info(`Successfully wrote to ${path}`);
	} catch (error) {
		throw new Error(
			`Failed to write to ${path}: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

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

async function buildDemoRegistry(): Promise<void> {
	try {
		const inputDemosDir = resolvePath(config.paths.inputDemos);
		const outputPath = resolvePath(config.paths.outputDemoJson);
		const files = await fs.readdir(inputDemosDir);

		const components: Record<string, string> = {};
		for (const file of files) {
			const name = file.replace(".svelte", "");
			const content = await fs.readFile(join(inputDemosDir, file), "utf-8");
			components[name] = content.replaceAll(
				/src="\/([^"]*)"/g,
				'src="https://bits-ui.com/$1"'
			);
		}

		await writeJsonFile(outputPath, components);
	} catch (error) {
		throw new Error(
			`Failed to build demo registry: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

async function createSvelteProject(): Promise<string> {
	try {
		const uniqueDirName = `svelte-project-${Date.now()}`;
		const projectDir = join(tmpdir(), uniqueDirName);

		await fs.mkdir(projectDir, { recursive: true });
		await execPromise(config.commands.createProject, { cwd: projectDir });

		console.info(`Created temporary Svelte project at ${projectDir}`);
		return projectDir;
	} catch (error) {
		throw new Error(
			`Failed to create Svelte project: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

async function getLibFiles(): Promise<FileMap> {
	return {
		"src/lib/utils/styles.ts": readFileSync(resolvePath(config.paths.utilsStyles), "utf8"),
		"src/routes/+layout.svelte": readFileSync(resolvePath(config.paths.demoLayout), "utf8"),
	};
}

async function buildBaseStackBlitzFiles(files: FileMap): Promise<void> {
	try {
		const outputPath = resolvePath(config.paths.outputStackblitz);
		const packageJson = JSON.parse(files["package.json"]);

		// Add dependencies
		for (const dep of config.bitsDependencies) {
			if (dep === "bits-ui") {
				packageJson.devDependencies["bits-ui"] = bitsPackageJson.version;
			} else {
				// @ts-expect-error - We know these dependencies exist
				const docsDep = docsPackageJson.devDependencies[dep];
				packageJson.devDependencies[dep] = docsDep;
			}
		}

		packageJson.scripts["start"] = "vite";

		const libFiles = await getLibFiles();
		const outputFiles = {
			...files,
			"package.json": JSON.stringify(packageJson, null, 2),
			...libFiles,
		};

		await writeJsonFile(outputPath, outputFiles);
	} catch (error) {
		throw new Error(
			`Failed to build StackBlitz files: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

async function main(): Promise<void> {
	console.info("Building demo files for StackBlitz");
	let projectDir = "";

	try {
		console.info("Creating temp Svelte project");
		projectDir = await createSvelteProject();

		console.info("Collecting project files");
		const files = await collectFiles(projectDir, projectDir);

		console.info("Building StackBlitz files");
		await buildBaseStackBlitzFiles(files);

		console.info("Building demo registry");
		await buildDemoRegistry();

		console.info("Successfully built StackBlitz files");
	} catch (error) {
		console.error("Failed to build StackBlitz files", error);
		process.exit(1);
	} finally {
		// Clean up the temp dir
		if (projectDir) {
			try {
				console.info(`Cleaning up temp project at ${projectDir}`);
				await removeDir(projectDir);
				console.info("Temp project cleaned up successfully");
			} catch (cleanupError) {
				console.error("Failed to clean up temp directory", cleanupError);
			}
		}
	}
}

main();
