// thanks @joyofcodedev for this :)
import FlexSearch from "flexsearch";

export type SearchContent = {
	title: string;
	content: string;
	description: string;
	href: string;
};

export type SearchResult = SearchContent & {
	snippet?: string;
	highlights?: string[];
	category?: string;
};

let titleIndex: FlexSearch.Index;
let contentIndex: FlexSearch.Index;
let content: SearchContent[] = [];

export function createContentIndex(data: SearchContent[]) {
	titleIndex = new FlexSearch.Index({
		tokenize: "forward",
		resolution: 9,
	});

	contentIndex = new FlexSearch.Index({
		tokenize: "forward",
		resolution: 5,
	});

	data.forEach((item, i) => {
		titleIndex.add(i, item.title);
		contentIndex.add(i, `${item.content} ${item.description}`);
	});

	content = data;
}

function getContentSnippet(content: string, query: string, maxLength = 150): string {
	const words = query.toLowerCase().split(/\s+/);
	const contentLower = content.toLowerCase();

	let bestIndex = -1;

	for (const word of words) {
		const index = contentLower.indexOf(word);
		if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
			bestIndex = index;
		}
	}

	if (bestIndex === -1) {
		return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "");
	}

	const start = Math.max(0, bestIndex - Math.floor(maxLength / 2));
	const end = Math.min(content.length, start + maxLength);
	const snippet = content.slice(start, end);

	return (start > 0 ? "..." : "") + snippet + (end < content.length ? "..." : "");
}

function highlightMatches(text: string, query: string): string {
	const words = query
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 1);
	let highlighted = text;

	for (const word of words) {
		const regex = new RegExp(`(${word})`, "gi");
		highlighted = highlighted.replace(regex, "<mark>$1</mark>");
	}

	return highlighted;
}

function categorizeResult(href: string): string {
	if (href.includes("/components/")) return "Components";
	if (href.includes("/utilities/")) return "Utilities";
	if (href.includes("/type-helpers/")) return "Type Helpers";
	return "Guides";
}

export function searchContentIndex(query: string): SearchResult[] {
	if (!query.trim()) return [];

	const titleResults = titleIndex.search(query, { limit: 20 });
	const contentResults = contentIndex.search(query, { limit: 20 });

	const resultMap = new Map<FlexSearch.Id, { score: number; source: string }>();

	for (const id of titleResults) {
		resultMap.set(id, { score: 10, source: "title" });
	}

	for (const id of contentResults) {
		const existing = resultMap.get(id);
		if (existing) {
			existing.score += 5;
		} else {
			resultMap.set(id, { score: 5, source: "content" });
		}
	}

	const sortedResults = Array.from(resultMap.entries())
		.sort(([, a], [, b]) => b.score - a.score)
		.slice(0, 10);

	return sortedResults.map(([idx]) => {
		const item = content[idx as number];
		const snippet = getContentSnippet(item.content, query);
		return {
			...item,
			snippet: highlightMatches(snippet, query),
			highlights: query
				.toLowerCase()
				.split(/\s+/)
				.filter((w) => w.length > 1),
			category: categorizeResult(item.href),
		};
	});
}
