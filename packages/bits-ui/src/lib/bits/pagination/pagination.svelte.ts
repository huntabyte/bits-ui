import { getContext, setContext } from "svelte";
import type { Page, PageItem } from "./types.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
} from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { getDataOrientation } from "$lib/internal/attrs.js";
import { getElemDirection } from "$lib/internal/locale.js";
import { getDirectionalKeys, kbd } from "$lib/internal/kbd.js";

type PaginationRootStateProps = ReadonlyBoxedValues<{
	id: string;

	/**
	 * The total number of items to be paginated.
	 */
	count: number;

	/**
	 * The number of items per page.
	 */
	perPage: number;

	/**
	 * The number of visible items before and after the current page.
	 */
	siblingCount: number;

	/**
	 * The orientation of the pagination component. Used to
	 * determine how keyboard navigation should work between
	 * pages.
	 */
	orientation: Orientation;

	/**
	 * Whether keyboard navigation should loop back to the
	 * first or last page trigger when reaching either end.
	 */
	loop: boolean;
}> &
	BoxedValues<{
		/**
		 * The current page number.
		 */
		page: number;
	}>;

class PaginationRootState {
	id = undefined as unknown as PaginationRootStateProps["id"];
	orientation = undefined as unknown as PaginationRootStateProps["orientation"];
	node = boxedState<HTMLElement | null>(null);
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
	props = $derived({
		id: this.id.value,
		"data-pagination-root": "",
		"data-orientation": getDataOrientation(this.orientation.value),
	});

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
}

//
// PAGE
//

type PaginationPageStateProps = ReadonlyBoxedValues<{
	id: string;
	page: Page;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}>;

class PaginationPage {
	#id = undefined as unknown as PaginationPageStateProps["id"];
	#root = undefined as unknown as PaginationRootState;
	#node = boxedState<HTMLElement | null>(null);
	page = undefined as unknown as PaginationPageStateProps["page"];
	#composedClick = undefined as unknown as EventCallback<MouseEvent>;
	#composedKeydown = undefined as unknown as EventCallback<KeyboardEvent>;
	props = $derived({
		id: this.#id.value,
		"aria-label": `Page ${this.page.value}`,
		"data-value": `${this.page.value}`,
		"data-pagination-page": "",
		"data-selected": this.page.value.value === this.#root.page.value ? "" : undefined,
		//
		onclick: this.#composedClick,
		onkeydown: this.#composedKeydown,
	} as const);

	constructor(props: PaginationPageStateProps, root: PaginationRootState) {
		this.#root = root;
		this.#id = props.id;
		this.page = props.page;
		this.#node = useNodeById(this.#id);
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);
	}

	#onclick = () => {
		this.#root.setPage(this.page.value.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.#node.value, this.#root);
	};
}

//
// NEXT/PREV BUTTON
//

type PaginationButtonStateProps = ReadonlyBoxedValues<{
	id: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}> & {
	type: "prev" | "next";
};

class PaginationButtonState {
	id = undefined as unknown as PaginationButtonStateProps["id"];
	#root = undefined as unknown as PaginationRootState;
	node = boxedState<HTMLElement | null>(null);
	type = $state() as PaginationButtonStateProps["type"];
	#composedClick = undefined as unknown as EventCallback<MouseEvent>;
	#composedKeydown = undefined as unknown as EventCallback<KeyboardEvent>;
	props = $derived({
		id: this.id.value,
		"data-pagination-prev": this.type === "prev" ? "" : undefined,
		"data-pagination-next": this.type === "next" ? "" : undefined,
		//
		onclick: this.#composedClick,
		onkeydown: this.#composedKeydown,
	} as const);

	constructor(props: PaginationButtonStateProps, root: PaginationRootState) {
		this.#root = root;
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.type = props.type;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);
	}

	#onclick = () => {
		if (this.type === "prev") {
			this.#root.prevPage();
		} else {
			this.#root.nextPage();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.node.value, this.#root);
	};
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

const PAGINATION_ROOT_KEY = Symbol("Pagination.Root");

export function setPaginationRootState(props: PaginationRootStateProps) {
	return setContext(PAGINATION_ROOT_KEY, new PaginationRootState(props));
}

export function getPaginationRootState(): PaginationRootState {
	return getContext(PAGINATION_ROOT_KEY);
}

export function setPaginationPageState(props: PaginationPageStateProps) {
	return getPaginationRootState().createPage(props);
}

export function setPaginationButtonState(props: PaginationButtonStateProps) {
	return getPaginationRootState().createButton(props);
}
