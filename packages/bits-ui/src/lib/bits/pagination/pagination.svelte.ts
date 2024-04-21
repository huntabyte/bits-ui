import type { BoxedValues, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";

type PaginationRootStateProps = ReadonlyBoxedValues<{
	id: string;

	/**
	 * The total number of items to be paginated.
	 */
	count: number;

	/**
	 * The number of items per page.
	 */
	limit: number;

	/**
	 * The number of visible items before and after the current page.
	 */
	siblingCount: number;
}> &
	BoxedValues<{
		/**
		 * The current page number.
		 */
		page: number;
	}>;

class PaginationRootState {
	id = undefined as unknown as PaginationRootStateProps["id"];
	count = undefined as unknown as PaginationRootStateProps["count"];
	limit = undefined as unknown as PaginationRootStateProps["limit"];
	siblingCount = undefined as unknown as PaginationRootStateProps["siblingCount"];
	page = undefined as unknown as PaginationRootStateProps["page"];
	totalPages = $derived(Math.ceil(this.count.value / this.limit.value));
	range = $derived.by(() => {
		const start = (this.page.value - 1) * this.limit.value;
		const end = Math.min(start + this.limit.value, this.count.value);
		return { start, end };
	});
	props = $derived({
		id: this.id,
		"data-pagination-root": "",
	});

	constructor(props: PaginationRootStateProps) {
		this.id = props.id;
		this.count = props.count;
		this.limit = props.limit;
		this.siblingCount = props.siblingCount;
		this.page = props.page;
	}
}
