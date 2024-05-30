import { box } from "svelte-toolbelt";
import type { Page, PageItem } from "./types.js";
import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	getDataOrientation,
	getDirectionalKeys,
	getElemDirection,
	kbd,
	useNodeById,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";

type PaginationRootStateProps = ReadableBoxedValues<{
	id: string;
	count: number;
	perPage: number;
	siblingCount: number;
	orientation: Orientation;
	loop: boolean;
}> &
	WritableBoxedValues<{
		page: number;
	}>;

class PaginationRootState {
	id = undefined as unknown as PaginationRootStateProps["id"];
	orientation = undefined as unknown as PaginationRootStateProps["orientation"];
	node = box<HTMLElement | null>(null);
	count = undefined as unknown as PaginationRootStateProps["count"];
	perPage = undefined as unknown as PaginationRootStateProps["perPage"];
	siblingCount = undefined as unknown as PaginationRootStateProps["siblingCount"];
	page = undefined as unknown as PaginationRootStateProps["page"];
	loop = undefined as unknown as PaginationRootStateProps["loop"];
	totalPages = $derived(Math.ceil(this.count.value / this.perPage.value));
	range = $derived.by(() => {
		const start = (this.page.value - 1) * this.perPage.value;
		const end = Math.min(start + this.perPage.value, this.count.value);
		return { start, end };
	});
	pages = $derived(
		getPageItems({
			page: this.page.value,
			totalPages: this.totalPages,
			siblingCount: this.siblingCount.value,
		})
	);

	constructor(props: PaginationRootStateProps) {
		this.id = props.id;
		this.perPage = props.perPage;
		this.count = props.count;
		this.node = useNodeById(this.id);
		this.siblingCount = props.siblingCount;
		this.page = props.page;
		this.orientation = props.orientation;
		this.loop = props.loop;
	}

	setPage(page: number) {
		this.page.value = page;
	}

	getPageTriggerNodes() {
		const node = this.node.value;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>("[data-pagination-page]"));
	}

	getButtonNode(type: "prev" | "next") {
		const node = this.node.value;
		if (!node) return;
		return node.querySelector<HTMLElement>(`[data-pagination-${type}]`);
	}

	prevPage() {
		this.page.value = Math.max(this.page.value - 1, 1);
	}

	nextPage() {
		this.page.value = Math.min(this.page.value + 1, this.totalPages);
	}

	createPage(props: PaginationPageStateProps) {
		return new PaginationPage(props, this);
	}

	createButton(props: PaginationButtonStateProps) {
		return new PaginationButtonState(props, this);
	}

	props = $derived({
		id: this.id.value,
		"data-pagination-root": "",
		"data-orientation": getDataOrientation(this.orientation.value),
	});
}

//
// PAGE
//

type PaginationPageStateProps = ReadableBoxedValues<{
	id: string;
	page: Page;
}>;

class PaginationPage {
	#id = undefined as unknown as PaginationPageStateProps["id"];
	#root = undefined as unknown as PaginationRootState;
	#node = box<HTMLElement | null>(null);
	page = undefined as unknown as PaginationPageStateProps["page"];

	constructor(props: PaginationPageStateProps, root: PaginationRootState) {
		this.#root = root;
		this.#id = props.id;
		this.page = props.page;
		this.#node = useNodeById(this.#id);
	}

	#onclick = () => {
		this.#root.setPage(this.page.value.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.#node.value, this.#root);
	};

	props = $derived({
		id: this.#id.value,
		"aria-label": `Page ${this.page.value}`,
		"data-value": `${this.page.value}`,
		"data-pagination-page": "",
		"data-selected": this.page.value.value === this.#root.page.value ? "" : undefined,
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// NEXT/PREV BUTTON
//

type PaginationButtonStateProps = ReadableBoxedValues<{
	id: string;
}> & {
	type: "prev" | "next";
};

class PaginationButtonState {
	id = undefined as unknown as PaginationButtonStateProps["id"];
	#root = undefined as unknown as PaginationRootState;
	node = box<HTMLElement | null>(null);
	type = $state() as PaginationButtonStateProps["type"];

	constructor(props: PaginationButtonStateProps, root: PaginationRootState) {
		this.#root = root;
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.type = props.type;
	}

	#onclick = () => {
		this.type === "prev" ? this.#root.prevPage() : this.#root.nextPage();
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.node.value, this.#root);
	};

	props = $derived({
		id: this.id.value,
		"data-pagination-prev": this.type === "prev" ? "" : undefined,
		"data-pagination-next": this.type === "next" ? "" : undefined,
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// HELPERS
//

/**
 * Shared logic for handling keyboard navigation on
 * pagination page triggers and prev/next buttons.
 *
 *
 * @param e - KeyboardEvent
 * @param node - The HTMLElement that triggered the event.
 * @param root - The root pagination state instance
 */
function handleTriggerKeydown(
	e: KeyboardEvent,
	node: HTMLElement | null,
	root: PaginationRootState
) {
	if (!node || !root.node.value) return;
	const items = root.getPageTriggerNodes();
	const nextButton = root.getButtonNode("next");
	const prevButton = root.getButtonNode("prev");

	if (prevButton) {
		items.unshift(prevButton);
	}
	if (nextButton) {
		items.push(nextButton);
	}

	const currentIndex = items.indexOf(node);

	const dir = getElemDirection(root.node.value);

	const { nextKey, prevKey } = getDirectionalKeys(dir, root.orientation.value);

	const loop = root.loop.value;

	const keyToIndex = {
		[nextKey]: currentIndex + 1,
		[prevKey]: currentIndex - 1,
		[kbd.HOME]: 0,
		[kbd.END]: items.length - 1,
	};

	let itemIndex = keyToIndex[e.key];
	if (itemIndex === undefined) return;
	e.preventDefault();

	if (itemIndex < 0 && loop) {
		itemIndex = items.length - 1;
	} else if (itemIndex === items.length && loop) {
		itemIndex = 0;
	}

	const itemToFocus = items[itemIndex];
	if (!itemToFocus) return;

	itemToFocus.focus();
}

type GetPageItemsProps = {
	page?: number;
	totalPages: number;
	siblingCount?: number;
};

/**
 * Returns an array of page items used to render out the
 * pagination page triggers.
 *
 * Credit: https://github.com/melt-ui/melt-ui
 */
function getPageItems({ page = 1, totalPages, siblingCount = 1 }: GetPageItemsProps): PageItem[] {
	const pageItems: PageItem[] = [];
	const pagesToShow = new Set([1, totalPages]);
	const firstItemWithSiblings = 3 + siblingCount;
	const lastItemWithSiblings = totalPages - 2 - siblingCount;

	if (firstItemWithSiblings > lastItemWithSiblings) {
		for (let i = 2; i <= totalPages - 1; i++) {
			pagesToShow.add(i);
		}
	} else if (page < firstItemWithSiblings) {
		for (let i = 2; i <= Math.min(firstItemWithSiblings, totalPages); i++) {
			pagesToShow.add(i);
		}
	} else if (page > lastItemWithSiblings) {
		for (let i = totalPages - 1; i >= Math.max(lastItemWithSiblings, 2); i--) {
			pagesToShow.add(i);
		}
	} else {
		for (
			let i = Math.max(page - siblingCount, 2);
			i <= Math.min(page + siblingCount, totalPages);
			i++
		) {
			pagesToShow.add(i);
		}
	}

	function addPage(value: number): void {
		pageItems.push({ type: "page", value, key: `page-${value}` });
	}

	function addEllipsis(): void {
		pageItems.push({ type: "ellipsis", key: "ellipsis" });
	}

	let lastNumber = 0;

	for (const p of Array.from(pagesToShow).sort((a, b) => a - b)) {
		if (p - lastNumber > 1) {
			addEllipsis();
		}
		addPage(p);
		lastNumber = p;
	}

	return pageItems;
}

//
// CONTEXT METHODS
//

const [setPaginationRootContext, getPaginationRootContext] =
	createContext<PaginationRootState>("Pagination.Root");

export function usePaginationRoot(props: PaginationRootStateProps) {
	return setPaginationRootContext(new PaginationRootState(props));
}

export function usePaginationPage(props: PaginationPageStateProps) {
	return getPaginationRootContext().createPage(props);
}

export function usePaginationButton(props: PaginationButtonStateProps) {
	return getPaginationRootContext().createButton(props);
}
