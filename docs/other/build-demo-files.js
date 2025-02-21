// this is gonna be real ugly until I am satisfied with the output and ready to clean it up
import { promises as fs, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { tmpdir } from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import docsPackageJson from "../package.json" with { type: "json" };

const execPromise = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssFilePath = join(__dirname, "../src/lib/styles/app.css");
const cssContent = readFileSync(cssFilePath, "utf-8");
const stackblitzDataPath = join(__dirname, "../src/lib/generated/stackblitz-data.ts");
const demoJsonPath = join(__dirname, "../src/routes/api/demos.json/demos.json");

// ideally we extract these on a per demo basis, but for now this will do
const bitsDeps = [
	"bits-ui",
	"@internationalized/date",
	"phosphor-svelte",
	"clsx",
	"@nobie-org/tailwindcss-animate",
	"tailwind-merge",
];

const libFiles = {
	"src/lib/utils/styles.ts": readFileSync(join(__dirname, "../src/lib/utils/styles.ts"), "utf8"),
};

const outputBaseContent = `// This file is generated by /other/build-demo-files.js
// Do not modify this file directly.

export type StackBlitzData = {
	files: Record<string, string>;
	dependencies: Record<string, string>;
};

// prettier-ignore
export const stackblitzData: StackBlitzData = `;

const IGNORE_LIST = ["node_modules", ".svelte-kit", "pnpm-lock.yaml", "static/favicon.png"];

/**
 * Recursively collects file information from a directory, excluding specified directories.
 * @param {string} currentDir - The current directory to traverse.
 * @param {string} baseDir - The project root directory for calculating relative paths.
 * @returns {Promise<Record<string, string>>} - Array of objects with path as key and content as value.
 */
async function collectFiles(currentDir, baseDir) {
	const entries = await fs.readdir(currentDir, { withFileTypes: true });

	const files = {};

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
				content = content.replace(
					"%sveltekit.assets%/favicon.png",
					"https://bits-ui.com/favicon.png"
				);
			}

			if (relPath === "src/app.css") {
				content = cssContent;
			}

			// @ts-expect-error - shh
			files[relPath] = content;
		}
	}

	// @ts-expect-error - shh
	return files;
}

/**
 * Extracts deps from package.json content.
 * @param {Record<string, any>} packageJsonContent - The content of package.json as a string.
 * @returns {Record<string, string>} - Array of objects with package name as key and version as value.
 */
function extractDependencies(packageJsonContent) {
	try {
		const pkg = packageJsonContent;
		return { ...pkg.dependencies, ...pkg.devDependencies };
	} catch (error) {
		if (error instanceof Error) {
			console.error("Failed to parse package.json for dependencies:", error.message);
		}
		return {};
	}
}

/**
 * Removes a directory and all its contents recursively.
 * @param {string} dirPath - The directory to remove.
 * @returns {Promise<void>}
 */
async function removeDir(dirPath) {
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

async function buildDemoComponentJson() {
	const dir = join(__dirname, "../src/lib/components/demos");
	// get all .svelte files in the directory
	const files = await fs.readdir(dir);
	/** @type Record<string, string> */
	const components = {};
	for (const file of files) {
		const name = file.replace(".svelte", "");
		const content = await fs.readFile(join(dir, file), "utf-8");
		components[name] = content;
	}

	const jsonOutput = JSON.stringify(components, null, 2);
	console.log("Writing demo components to", demoJsonPath);
	await fs.mkdir(dirname(demoJsonPath), { recursive: true });
	await fs.writeFile(demoJsonPath, jsonOutput, "utf-8");
}

/**
 * Main function to create a Svelte project, collect its file information,
 * extract dependencies, and clean up.
 * @returns {Promise<void>}
 */
async function main() {
	let projectDir = "";
	try {
		// create temp dir
		const tempDir = tmpdir();
		const uniqueDirName = `svelte-project-${Date.now()}`;
		projectDir = join(tempDir, uniqueDirName);
		await fs.mkdir(projectDir, { recursive: true });
		console.log(`Created temporary directory: ${projectDir}`);

		// create svelte project
		const command =
			"pnpx sv@latest create . --template=minimal --types=ts --no-add-ons --no-install";
		console.log(`Running command: ${command} in ${projectDir}`);
		await execPromise(command, { cwd: projectDir });
		console.log("Project created successfully.");

		// add tailwindcss
		const command2 = "pnpx sv@latest add tailwindcss --no-preconditions --no-install";
		console.log(`Running command: ${command2} in ${projectDir}`);
		await execPromise(command2, { cwd: projectDir });
		console.log("TailwindCSS added successfully.");

		// collect files
		console.log("Collecting files...");
		const files = await collectFiles(projectDir, projectDir);
		console.log(`Collected ${files.length} files.`);

		// extract deps
		const packageJson = JSON.parse(files["package.json"]);
		for (const dep of bitsDeps) {
			if (dep === "bits-ui") {
				packageJson.devDependencies["bits-ui"] = "latest";
				continue;
			}

			// @ts-expect-error shhh
			const docsDep = docsPackageJson.devDependencies[dep];

			packageJson.devDependencies[dep] = docsDep;
		}

		const dependencies = packageJson ? extractDependencies(packageJson) : [];
		console.log(`Extracted ${dependencies.length} dependencies.`);

		const output = {
			files: {
				...files,
				...libFiles,
			},
			dependencies,
		};
		const jsonOutput = JSON.stringify(output, null, 2);
		await fs.mkdir(dirname(stackblitzDataPath), { recursive: true });
		await fs.writeFile(stackblitzDataPath, outputBaseContent + jsonOutput, "utf-8");
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
				console.log(`Cleaning up: Removing ${projectDir}`);
				await removeDir(projectDir);
				console.log("Temp directory removed.");
			} catch (cleanupError) {
				if (cleanupError instanceof Error) {
					console.error("Failed to clean up temporary directory:", cleanupError.message);
				}
			}
		}
	}

	try {
		await buildDemoComponentJson();
	} catch (err) {
		console.error(err);
	}
}

// Execute the main function
main();
