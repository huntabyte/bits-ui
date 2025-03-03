import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(
	__dirname,
	"../.svelte-kit/output/prerendered/pages/docs/components/accordion.html"
);
const rawHtml = await readFile(path, "utf8");
const dom = new JSDOM(rawHtml);
const document = dom.window.document;
const codeTags = document?.querySelectorAll("code");
if (codeTags) {
	for (const code of codeTags) {
		const language = code.getAttribute("data-language");
		if (language) {
			code.className = `${code.className || ""} language-${language}`.trim();
		}
	}
}
const targetElement = document.getElementById("main-content");

const elementsToRemove = Array.from(document.querySelectorAll<HTMLElement>("[data-llm-ignore]"));

for (const element of elementsToRemove) {
	element.remove();
}

const html = targetElement ? targetElement.innerHTML : "";

function removeHTMLComments(html: string) {
	return html.replace(/<!--.*?-->/gs, "");
}

const file = await unified()
	.use(rehypeParse)
	.use(rehypeRemark)
	.use(remarkGfm)
	.use(remarkStringify, {
		bullet: "-", // Use dashes for bullets
		listItemIndent: "one", // Controls list item indentation
		tightDefinitions: true,
		fences: true,
	})
	.process(html);

const processedFile = removeHTMLComments(String(file)).trim();

const cleanMarkdown = processedFile
	.replace(/\n{3,}/g, "\n\n") // replace 3+ newlines with 2
	.replace(/- \n\s+/g, "- ") // fix bullet point spacing
	.replace(/(\n|^)[ \t]+\n/g, "$1") // start of line or after newline
	.replace(/\n[ \t]+($|\n)/g, "$1") // end of line or before newline
	.replace(/(\S+)\s*\n\s*(`[^`]+?`)/g, "$1 $2") // inline code that handles special characters
	.replace(/(`[^`]+?`)\s*\n\s*(\S+)/g, "$1 $2") // for parentheses with code blocks inside
	.replace(/\(\s*\n\s*(`[^`]+?`)/g, "($1")
	.replace(/(`[^`]+?`)\s*\n\s*\)/g, "$1)")
	.replace(/```([a-z]*)\n\t/g, "```$1\n"); // fix code block indents

await writeFile(join(__dirname, "accordion.md"), cleanMarkdown);
