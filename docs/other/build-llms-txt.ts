import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import consola from "consola";

consola.wrapConsole();

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
		.replace(/- \n\s+/g, "- ") // fix basic bullet point spacing
		.replace(/(- [^\n]*)(?:\n\s+([^\n-][^\n]*))/g, "$1 $2") // multi-line bullets with indented continuations
		.replace(/(\n|^)[ \t]+\n/g, "$1") // start of line or after newline
		.replace(/\n[ \t]+($|\n)/g, "$1") // end of line or before newline
		.replace(/(\S+)\s*\n\s*(`[^`]+?`)/g, "$1 $2") // inline code that handles special characters
		.replace(/(`[^`]+?`)\s*\n\s*(\S+)/g, "$1 $2") // for parentheses with code blocks inside
		.replace(/\(\s*\n\s*(`[^`]+?`)/g, "($1")
		.replace(/(`[^`]+?`)\s*\n\s*\)/g, "$1)")
		.replace(/\\`([^`]+?)\\`/g, "`$1`") // remove escaping backticks around inline code
		.replace(/```([a-z]*)\n\t/g, "```$1\n"); // fix code block indents

	return cleanMarkdown;
}

async function generateRootLLMsTxt(fileNames: string[]) {
	let content = "# Bits UI Documentation for LLMs\n\n";

	content += "> Bits UI is a headless component library for Svelte.\n\n";

	content +=
		"This site provides documentation in a format optimized for Large Language Models, with each page available as a clean markdown file.\n\n";

	content += "## Complete Documentation\n\n";
	content +=
		"- [Complete documentation](https://bits-ui.com/docs/llms.txt): The complete Bits UI documentation included all general content, components, type helpers, and utilities\n";

	const sections: Record<string, string[]> = {
		General: [],
		Components: [],
		Utilities: [],
		"Type Helpers": [],
	};

	for (const fileName of fileNames) {
		if (!fileName.endsWith(".html")) continue;

		const baseName = basename(fileName, ".html");
		const dirPath = dirname(fileName);
		const relativePath = join(dirPath, baseName, "llms.txt");

		if (dirPath === ".") {
			sections["General"].push(`${baseName}|${relativePath}`);
		} else if (dirPath.startsWith("components")) {
			sections["Components"].push(`${baseName}|${relativePath}`);
		} else if (dirPath.startsWith("utilities")) {
			sections["Utilities"].push(`${baseName}|${relativePath}`);
		} else if (dirPath.startsWith("type-helpers")) {
			sections["Type Helpers"].push(`${baseName}|${relativePath}`);
		}
	}

	for (const [sectionName, files] of Object.entries(sections)) {
		if (files.length === 0) continue;

		content += `## ${sectionName}\n\n`;

		for (const file of files) {
			const [baseName, path] = file.split("|");
			const linkTitle = baseName.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
			content += `- [${linkTitle} Documentation](https://bits-ui.com/docs/${path}): Detailed documentation for ${linkTitle}\n`;
		}

		content += "\n";
	}

	return content;
}

async function main() {
	try {
		consola.info("Starting to build LLMS files...");
		const rootPath = join(__dirname, "../.svelte-kit/cloudflare/docs");
		console.info("Collecting files from", rootPath);
		const files = await collectFiles(rootPath, rootPath);
		const fileNames = Object.keys(files);

		// store content by category
		const contentByCategory: Record<string, string[]> = {
			Introduction: [],
			"Other Main content": [],
			Components: [],
			Utilities: [],
			"Type Helpers": [],
		};

		// build individual llms.txt files and collect content
		for (const fileName of fileNames) {
			console.info("Processing", fileName);
			if (!fileName.endsWith(".html")) continue;

			const fileContent = files[fileName];
			const cleanedContent = await transformAndSaveMarkdown(fileContent);

			const baseName = basename(fileName, ".html");
			const dirPath = dirname(fileName);

			const outputPath = join(
				__dirname,
				"../.svelte-kit/cloudflare/docs",
				dirPath,
				baseName,
				"llms.txt"
			);
			const outputDir = dirname(outputPath);
			await mkdir(outputDir, { recursive: true });
			await writeFile(outputPath, cleanedContent);

			// Categorize content
			const contentWithSeparator =
				cleanedContent + "\n\n----------------------------------------------------\n\n";
			if (dirPath === "." && baseName === "introduction") {
				contentByCategory["Introduction"].push(contentWithSeparator);
			} else if (dirPath === ".") {
				if (baseName === "migration-guide") continue;
				contentByCategory["Other Main content"].push(contentWithSeparator);
			} else if (dirPath.startsWith("components")) {
				contentByCategory["Components"].push(contentWithSeparator);
			} else if (dirPath.startsWith("utilities")) {
				contentByCategory["Utilities"].push(contentWithSeparator);
			} else if (dirPath.startsWith("type-helpers")) {
				contentByCategory["Type Helpers"].push(contentWithSeparator);
			}
		}

		// combine content in the specified order
		const order = [
			"Introduction",
			"Other Main content",
			"Components",
			"Utilities",
			"Type Helpers",
		];
		let allContent = "";
		for (const category of order) {
			if (contentByCategory[category].length > 0) {
				allContent += contentByCategory[category].join("");
			}
		}

		// generate and save root llms.txt
		console.info("Generating root llms.txt");
		const rootLLMsContent = await generateRootLLMsTxt(fileNames);
		const rootOutputPath = join(__dirname, "../.svelte-kit/cloudflare", "llms.txt");
		await writeFile(rootOutputPath, rootLLMsContent);

		// save combined documentation
		console.info("Saving `/docs/llms.txt` with all content");
		const allOutputPath = join(__dirname, "../.svelte-kit/cloudflare/docs", "llms.txt");
		await writeFile(allOutputPath, allContent.trim());
	} catch (error) {
		console.error("Error building llms.txt files:", error);
	}
}

main();
