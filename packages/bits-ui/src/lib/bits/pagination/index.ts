export { default as Root } from "./components/pagination.svelte";
export { default as PrevButton } from "./components/pagination-prev-button.svelte";
export { default as NextButton } from "./components/pagination-next-button.svelte";
export { default as Page } from "./components/pagination-page.svelte";

export type {
	PaginationProps as Props,
	PaginationPrevButtonProps as PrevButtonProps,
	PaginationNextButtonProps as NextButtonProps,
	PaginationPageProps as PageProps,
	//
	PaginationEvents as Events,
	PaginationPrevButtonEvents as PrevButtonEvents,
	PaginationNextButtonEvents as NextButtonEvents,
	PaginationPageEvents as PageEvents,
} from "./types.js";
