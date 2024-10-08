import { useRefById } from "svelte-toolbelt";
import type { Page, PageItem } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { getDataOrientation } from "$lib/internal/attrs.js";
import { getElemDirection } from "$lib/internal/locale.js";
import { kbd } from "$lib/internal/kbd.js";
import { getDirectionalKeys } from "$lib/internal/get-directional-keys.js";
import { type Orientation, useId } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/create-context.js";

const ROOT_ATTR = "data-pagination-root";
const PAGE_ATTR = "data-pagination-page";
const PREV_ATTR = "data-pagination-prev";
const NEXT_ATTR = "data-pagination-next";

type PaginationRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		count: number;
		perPage: number;
		siblingCount: number;
		orientation: Orientation;
		loop: boolean;
	}> &
		WritableBoxedValues<{
			page: number;
		}>
>;

class PaginationRootState {
	id: PaginationRootStateProps["id"];
	ref: PaginationRootStateProps["ref"];
	orientation: PaginationRootStateProps["orientation"];
	count: PaginationRootStateProps["count"];
	perPage: PaginationRootStateProps["perPage"];
	siblingCount: PaginationRootStateProps["siblingCount"];
	page: PaginationRootStateProps["page"];
	loop: PaginationRootStateProps["loop"];
	totalPages = $derived.by(() => Math.ceil(this.count.current / this.perPage.current));
	range = $derived.by(() => {
		const start = (this.page.current - 1) * this.perPage.current;
		const end = Math.min(start + this.perPage.current, this.count.current);
		return { start, end };
	});
	pages = $derived.by(() =>
		getPageItems({
			page: this.page.current,
			totalPages: this.totalPages,
			siblingCount: this.siblingCount.current,
		})
	);

	constructor(props: PaginationRootStateProps) {
		this.id = props.id;
		this.perPage = props.perPage;
		this.count = props.count;
		this.siblingCount = props.siblingCount;
		this.page = props.page;
		this.orientation = props.orientation;
		this.loop = props.loop;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	setPage = (page: number) => {
		this.page.current = page;
	};

	getPageTriggerNodes = () => {
		const node = this.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>("[data-pagination-page]"));
	};

	getButtonNode = (type: "prev" | "next") => {
		const node = this.ref.current;
		if (!node) return;
		return node.querySelector<HTMLElement>(`[data-pagination-${type}]`);
	};

	prevPage = () => {
		this.page.current = Math.max(this.page.current - 1, 1);
	};

	nextPage = () => {
		this.page.current = Math.min(this.page.current + 1, this.totalPages);
	};

	snippetProps = $derived.by(() => ({
		pages: this.pages,
		range: this.range,
	}));

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				[ROOT_ATTR]: "",
			}) as const
	);
}

//
// PAGE
//

type PaginationPageStateProps = WithRefProps<
	ReadableBoxedValues<{
		page: Page;
	}>
>;

class PaginationPageState {
	#id: PaginationPageStateProps["id"];
	#ref: PaginationPageStateProps["ref"];
	#root: PaginationRootState;
	page: PaginationPageStateProps["page"];
	#isSelected = $derived.by(() => this.page.current.value === this.#root.page.current);

	constructor(props: PaginationPageStateProps, root: PaginationRootState) {
		this.#root = root;
		this.#id = props.id;
		this.page = props.page;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#root.setPage(this.page.current.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.#ref.current, this.#root);
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-label": `Page ${this.page.current}`,
				"data-value": `${this.page.current.value}`,
				"data-selected": this.#isSelected ? "" : undefined,
				[PAGE_ATTR]: "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

//
// NEXT/PREV BUTTON
//

type PaginationButtonStateProps = WithRefProps<{
	type: "prev" | "next";
}>;

class PaginationButtonState {
	id: PaginationButtonStateProps["id"];
	#ref: PaginationButtonStateProps["ref"];
	#root: PaginationRootState;
	type = $state() as PaginationButtonStateProps["type"];

	constructor(props: PaginationButtonStateProps, root: PaginationRootState) {
		this.#root = root;
		this.id = props.id;
		this.type = props.type;
		this.#ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.type === "prev" ? this.#root.prevPage() : this.#root.nextPage();
	};

	#onkeydown = (e: KeyboardEvent) => {
		handleTriggerKeydown(e, this.#ref.current, this.#root);
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[PREV_ATTR]: this.type === "prev" ? "" : undefined,
				[NEXT_ATTR]: this.type === "next" ? "" : undefined,
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
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
	if (!node || !root.ref.current) return;
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

	const dir = getElemDirection(root.ref.current);

	const { nextKey, prevKey } = getDirectionalKeys(dir, root.orientation.current);

	const loop = root.loop.current;

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
		const id = useId();
		pageItems.push({ type: "ellipsis", key: `ellipsis-${id}` });
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
	return new PaginationPageState(props, getPaginationRootContext());
}

export function usePaginationButton(props: PaginationButtonStateProps) {
	return new PaginationButtonState(props, getPaginationRootContext());
}
