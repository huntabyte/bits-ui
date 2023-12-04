import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { fileURLToPath } from "url";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { escapeSvelte } from "@huntabyte/mdsvex";
import path, { resolve } from "path";
import { readFileSync } from "fs";
import prettier from "prettier";
import { u } from "unist-builder";
import { codeBlockPrettierConfig } from "./other/code-block-prettier.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @type {import('rehype-pretty-code').Options}
 */
const prettyCodeOptions = {
	theme: {
		dark: JSON.parse(
			readFileSync(resolve(__dirname, "./src/styles/themes/serendipity-midnight.json"))
		),
		light: JSON.parse(
			readFileSync(resolve(__dirname, "./src/styles/themes/serendipity-morning.json"))
		)
	},
	keepBackground: false,
	onVisitLine(node) {
		if (node.children.length === 0) {
			node.children = { type: "text", value: " " };
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className = ["line--highlighted"];
	},
	onVisitHighlightedWord(node) {
		node.properties.className = ["word--highlighted"];
	}
};

/** @type {import('@huntabyte/mdsvex').MdsvexOptions} */
export const mdsvexOptions = {
	extensions: [".md"],
	layout: resolve(__dirname, "./src/components/markdown/layout.svelte"),
	smartypants: {
		quotes: false,
		ellipses: false,
		backticks: false,
		dashes: false
	},
	remarkPlugins: [remarkGfm, remarkEscapeCode],
	rehypePlugins: [
		rehypeComponentExample,
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
		rehypeRenderCode,
		rehypePreToComponentPre
	]
};
export function rehypeComponentExample() {
	return async (tree) => {
		const nameRegex = /name="([^"]+)"/;
		const compRegex = /comp="([^"]+)"/;
		visit(tree, (node, index, parent) => {
			if (node?.type === "raw" && node?.value?.startsWith("<ComponentPreview")) {
				const nameMatch = node.value.match(nameRegex);
				const name = nameMatch ? nameMatch[1] : null;
				const compMatch = node.value.match(compRegex);
				const comp = compMatch ? compMatch[1] : null;

				if (!name || !comp) {
					return null;
				}

				try {
					let sourceCode = getComponentSourceFileContent(name);
					sourceCode = sourceCode.replaceAll(`@/components`, "@/components/");

					const sourceCodeNode = u("element", {
						tagName: "pre",
						properties: {
							className: ["code"]
						},
						children: [
							u("element", {
								tagName: "code",
								properties: {
									className: [`language-svelte`]
								},
								attributes: {},
								children: [
									{
										type: "text",
										value: sourceCode
									}
								]
							})
						]
					});
					if (!index) return;
					parent.children.splice(index + 1, 0, sourceCodeNode);
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e);
				}
			}
		});
	};
}

function getComponentSourceFileContent(src = undefined) {
	const newSrc = `./src/components/demos/${src}.svelte`;
	if (!newSrc) {
		return null;
	}

	// Read the source file.
	const filePath = path.join(process.cwd(), newSrc);

	const formattedSource = prettier.format(readFileSync(filePath, "utf-8"), codeBlockPrettierConfig);

	return formattedSource;
}

const entities = [
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	[/{/g, "&#123;"],
	[/}/g, "&#125;"]
];

function remarkEscapeCode() {
	return async (tree) => {
		visit(tree, "inlineCode", escape);

		function escape(node) {
			for (let i = 0; i < entities.length; i += 1) {
				node.value = node.value.replace(entities[i][0], entities[i][1]);
			}
		}
	};
}

function rehypeComponentPreToPre() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === "element" && node?.tagName === "Components.pre") {
				node.tagName = "pre";
			}
		});
	};
}

function rehypePreToComponentPre() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === "element" && node?.tagName === "pre") {
				node.tagName = "Components.pre";
			}
		});
	};
}

function rehypeHandleMetadata() {
	return async (tree) => {
		visit(tree, (node) => {
			if (node?.type === "element" && node?.tagName === "div") {
				if (!("data-rehype-pretty-code-fragment" in node.properties)) {
					return;
				}

				const preElement = node.children.at(-1);
				if (preElement.tagName !== "pre") {
					return;
				}

				if (node.children.at(0).tagName === "div") {
					node.properties["data-metadata"] = "";
				}
			}
		});
	};
}

function rehypeRenderCode() {
	return async (tree) => {
		visit(tree, (node) => {
			if (
				node?.type === "element" &&
				(node?.tagName === "Components.pre" || node?.tagName === "pre")
			) {
				/** @type HTMLElement */
				const codeEl = node.children[0];
				if (codeEl.tagName !== "code") {
					return;
				}

				const codeString = tabsToSpaces(
					toHtml(codeEl, {
						allowDangerousCharacters: true,
						allowDangerousHtml: true
					})
				);

				codeEl.type = "raw";

				codeEl.value = `{@html \`${escapeSvelte(codeString)}\`}`;
			}
		});
	};
}

function tabsToSpaces(code) {
	return code.replaceAll("    ", "  ").replaceAll("\t", "  ");
}
