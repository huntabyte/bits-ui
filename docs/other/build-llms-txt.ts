import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));

type FileMap = Record<string, string>;

async function collectFiles(currentDir: string, baseDir: string): Promise<FileMap> {
	try {
		const entries = await readdir(currentDir, { withFileTypes: true });
		const files: FileMap = {};

		for (const entry of entries) {
			const fullPath = join(currentDir, entry.name);
			const relPath = relative(baseDir, fullPath);

			if (entry.isDirectory()) {
				const subFiles = await collectFiles(fullPath, baseDir);
				Object.assign(files, subFiles);
			} else if (entry.isFile()) {
				let content = await readFile(fullPath, "utf-8");

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

async function transformAndSaveMarkdown(rawHtml: string) {
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

	const elementsToRemove = Array.from(
		document.querySelectorAll<HTMLElement>("[data-llm-ignore]")
	);

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

	return cleanMarkdown;
}

async function main() {
	const rootPath = join(__dirname, "../.svelte-kit/cloudflare/docs");
	const files = await collectFiles(rootPath, rootPath);
	const fileNames = Object.keys(files);

	let content = "";

	// build markdown files
	for (const fileName of fileNames) {
		if (!fileName.endsWith(".html")) continue;

		const fileContent = files[fileName];
		const endFileName = fileName.split("/").pop();
		const cleanedContent = await transformAndSaveMarkdown(fileContent);
		await writeFile(
			join(__dirname, `/md/`, endFileName!.replaceAll(".html", ".md")),
			cleanedContent
		);
		if (fileName.includes("introduction")) {
			content = cleanedContent + "\n\n" + content;
		} else {
			content += cleanedContent + "\n\n";
		}
	}

	// merge all markdown files into a single file
	await writeFile(join(__dirname, "/md/all.md"), content);
}

main();
