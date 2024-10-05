import { watch } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Configuration
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const dtsPath = join(__dirname, "../.velite/index.d.ts");
const indexPath = join(__dirname, "../.velite/index.js");
let isUpdatingDts = false;
let isUpdatingIndex = false;

async function replaceIndexDtsContents() {
	isUpdatingDts = true;

	const data = await readFile(dtsPath, "utf8").catch((err) => {
		console.error("Error reading file:", err);
		isUpdatingDts = false;
	});
	if (!data) return;

	const updatedContent = data.replace("'../velite.config'", "'../velite.config.js'");
	if (updatedContent === data) {
		isUpdatingDts = false;
		return;
	}

	await writeFile(dtsPath, updatedContent, "utf8").catch((err) => {
		console.error("Error writing file:", err);
	});
	isUpdatingDts = false;
}

async function replaceIndexContents() {
	isUpdatingIndex = true;

	const data = await readFile(indexPath, "utf8").catch((err) => {
		console.error("Error reading file:", err);
		isUpdatingIndex = false;
	});
	if (!data) return;

	const updatedContent = data.replaceAll(".json'", ".json' with { type: 'json' }");
	if (updatedContent === data) {
		isUpdatingIndex = false;
		return;
	}

	await writeFile(indexPath, updatedContent, "utf8").catch((err) => {
		console.error("Error writing file:", err);
	});
	isUpdatingIndex = false;
}

watch(dtsPath, async (eventType, filename) => {
	if (eventType === "change" && !isUpdatingDts) {
		console.info(`File ${filename} has been modified`);
		replaceIndexDtsContents();
	}
});

watch(indexPath, async (eventType, filename) => {
	if (eventType === "change" && !isUpdatingIndex) {
		console.info(`File ${filename} has been modified`);
		replaceIndexContents();
	}
});
