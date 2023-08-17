import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { fileURLToPath } from "url";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { escapeSvelte } from "@huntabyte/mdsvex";
import { resolve } from "path";
import { readFileSync } from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * @type {import('rehype-pretty-code').Options}
 */
const prettyCodeOptions = {
	theme: {
		dark: JSON.parse(
			readFileSync(resolve(__dirname, "./src/styles/themes/tokyo-night-storm.json"))
		),
		light: JSON.parse(
			readFileSync(resolve(__dirname, "./src/styles/themes/tokyo-night-light.json"))
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
		rehypeComponentPreToPre,
		[rehypePrettyCode, prettyCodeOptions],
		rehypeHandleMetadata,
		rehypeRenderCode,
		rehypePreToComponentPre
	]
};

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
		let counter = 0;
		visit(tree, (node) => {
			if (
				node?.type === "element" &&
				(node?.tagName === "Components.pre" || node?.tagName === "pre")
			) {
				counter++;

				const isNonPP = counter % 2 === 0;
				if (isNonPP) {
					node.properties = {
						...node.properties,
						"data-non-pp": ""
					};
				}

				/** @type HTMLElement */
				const codeEl = node.children[0];
				if (codeEl.tagName !== "code") {
					return;
				}

				const meltString = tabsToSpaces(
					toHtml(codeEl, {
						allowDangerousCharacters: true,
						allowDangerousHtml: true
					})
				);

				codeEl.type = "raw";

				codeEl.value = `{@html \`${escapeSvelte(meltString)}\`}`;
			}
		});
	};
}

function tabsToSpaces(code) {
	return code.replaceAll("    ", "  ").replaceAll("\t", "  ");
}
