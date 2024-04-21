import type { Snippet } from "svelte";
import type {
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
} from "$lib/internal/types.js";
import type { EventCallback, OnChangeFn } from "$lib/internal/index.js";

type PaginationSnippetProps = {
	pages: PageItem[];
	range: { start: number; end: number };
};

export type PaginationRootPropsWithoutHTML = Omit<
	WithAsChild<
		{
			/**
			 * The total number of items to be paginated.
			 */
			count: number;

			/**
			 * The number of items per page.
			 *
			 * @defaultValue 1
			 */
			perPage?: number;

			/**
			 * The number of visible items before and after the current page.
			 *
			 * @defaultValue 1
			 */
			siblingCount?: number;

			/**
			 * The current page number.
			 *
			 * @defaultValue 1
			 */
			page?: number;

			/**
			 * A callback function called when the page changes.
			 */
			onPageChange?: OnChangeFn<number>;

			/**
			 * Whether keyboard navigation should loop back to the
			 * first or last page trigger when reaching either end.
			 *
			 * @defaultValue false
			 */
			loop?: boolean;

			/**
			 * The orientation of the pagination component. Used to
			 * determine how keyboard navigation should work between
			 * pages.
			 *
			 * @defaultValue "horizontal"
			 */
			orientation?: "horizontal" | "vertical";
		},
		PaginationSnippetProps
	>,
	"children"
> & {
	/**
	 * Snippet used to provide the iterable information to render
	 * the pagination component.
	 */
	children: Snippet<[PaginationSnippetProps]>;
};

export type PaginationRootProps = PaginationRootPropsWithoutHTML & PrimitiveDivAttributes;

export type PaginationPagePropsWithoutHTML = WithAsChild<{
	page: Page;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type PaginationPageProps = PaginationPagePropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown">;

export type PaginationPrevButtonPropsWithoutHTML = WithAsChild<{
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type PaginationPrevButtonProps = PaginationPrevButtonPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown">;

export type PaginationNextButtonPropsWithoutHTML = WithAsChild<{
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type PaginationNextButtonProps = PaginationNextButtonPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown">;

export type Page = {
	type: "page";
	value: number;
};

export type Ellipsis = {
	type: "ellipsis";
};

export type PageItem = (Page | Ellipsis) & {
	/**
	 * A unique key to be used as the key in a svelte `#each` block.
	 */
	key: string;
};
