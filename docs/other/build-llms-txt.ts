import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Turndown from "turndown";
import { JSDOM } from "jsdom";

const turndownService = new Turndown();

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(
	__dirname,
	"../.svelte-kit/output/prerendered/pages/docs/components/accordion.html"
);
const rawHtml = await readFile(path, "utf8");
const dom = new JSDOM(rawHtml);
const document = dom.window.document;
const targetElement = document.getElementById("main-content");

const elementsToRemove = Array.from(document.querySelectorAll<HTMLElement>("[data-llm-ignore]"));

for (const element of elementsToRemove) {
	element.remove();
}

const html = targetElement ? targetElement.innerHTML : "";

const markdown = turndownService.turndown(html);
// write markdown to file
await writeFile(join(__dirname, "accordion.md"), markdown);
console.log(markdown);
