import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentInfo {
	name: string;
	exports: string[];
}

// components to ignore during extraction
const IGNORED_COMPONENTS = ["Menu"];

function extractExportsFromFile(filePath: string): string[] {
	try {
		const content = readFileSync(filePath, "utf-8");
		const exportMatches = content.match(/export\s+{\s*default\s+as\s+(\w+)\s*}/g) || [];

		return exportMatches
			.map((match) => {
				const nameMatch = match.match(/as\s+(\w+)/);
				return nameMatch ? nameMatch[1]! : "";
			})
			.filter(Boolean);
	} catch {
		return [];
	}
}

function extractComponents(): ComponentInfo[] {
	const bitsDir = resolve(__dirname, "../packages/bits-ui/src/lib/bits");
	const components: ComponentInfo[] = [];

	try {
		const componentDirs = readdirSync(bitsDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		for (const componentDir of componentDirs) {
			const exportsPath = join(bitsDir, componentDir, "exports.ts");
			const exports = extractExportsFromFile(exportsPath);

			if (exports.length > 0) {
				// capitalize first letter for component name
				const componentName = componentDir.charAt(0).toUpperCase() + componentDir.slice(1);
				// handle kebab-case names
				const formattedName = componentName.replace(/-([a-z])/g, (_, letter) =>
					letter.toUpperCase()
				);

				// skip ignored components
				if (!IGNORED_COMPONENTS.includes(formattedName)) {
					components.push({
						name: formattedName,
						exports,
					});
				}
			}
		}
	} catch (error) {
		console.error("Error extracting components:", error);
	}

	return components.sort((a, b) => a.name.localeCompare(b.name));
}

export { extractComponents, type ComponentInfo };
