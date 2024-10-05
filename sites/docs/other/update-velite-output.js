import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const fileName = "../.velite/index.d.ts";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const watchPath = join(__dirname, fileName);

async function replaceContents() {
	let content;

	const data = await readFile(watchPath, "utf8").catch((err) => {
		console.error("Error reading file:", err);
	});
	if (!data) return;

	const updatedContent = data.replace("'../velite.config'", "'../velite.config.js'");
	if (updatedContent === content) {
		return;
	}

	await writeFile(watchPath, updatedContent, "utf8").catch((err) => {
		console.error("Error writing file:", err);
	});
}

await replaceContents();
