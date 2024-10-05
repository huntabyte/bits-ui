import { watch } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Configuration
const fileName = "../.velite/index.d.ts";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const watchPath = join(__dirname, fileName);
let isUpdating = false;

async function replaceContents() {
	isUpdating = true;
	let content;

	const data = await readFile(watchPath, "utf8").catch((err) => {
		console.error("Error reading file:", err);
		isUpdating = false;
	});
	if (!data) return;

	const updatedContent = data.replace("'../velite.config'", "'../velite.config.js'");
	if (updatedContent === content) {
		isUpdating = false;
		return;
	}

	await writeFile(watchPath, updatedContent, "utf8").catch((err) => {
		console.error("Error writing file:", err);
	});
	isUpdating = false;
}

watch(watchPath, async (eventType, filename) => {
	if (eventType === "change" && !isUpdating) {
		console.info(`File ${filename} has been modified`);
		replaceContents();
	}
});

console.info(`Watching for changes in ${fileName}...`);
