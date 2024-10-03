import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreatePaginationProps as MeltPaginationProps, Page } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLDivAttributes } from "$lib/internal/types.js";
import type { DOMElement, Expand, OnChangeFn } from "$lib/internal/index.js";

type OmitPaginationProps<T> = Omit<T, "page" | "defaultPage" | "onPageChange">;

export type PaginationPropsWithoutHTML = Expand<
	OmitPaginationProps<MeltPaginationProps> & {
		/**
		 * The selected page. This updates as the users selects new pages.
		 *
		 * You can bind this to a value to programmatically control the value state.
		 */
		page?: number | undefined;

		/**
		 * A callback function called when the page changes.
		 */
		onPageChange?: OnChangeFn<number> | undefined;
	} & DOMElement
>;

export type PaginationPagePropsWithoutHTML = {
	page: Page;
} & DOMElement<HTMLButtonElement>;

export type PaginationPrevButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type PaginationNextButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;
//

export type PaginationProps = PaginationPropsWithoutHTML & HTMLDivAttributes;

export type PaginationPrevButtonProps = PaginationPrevButtonPropsWithoutHTML & HTMLButtonAttributes;

export type PaginationNextButtonProps = PaginationNextButtonPropsWithoutHTML & HTMLButtonAttributes;

export type PaginationPageProps = PaginationPagePropsWithoutHTML & HTMLButtonAttributes;

/**
 * Events
 */
type ButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

export type PaginationPrevButtonEvents = ButtonEvents;

export type PaginationNextButtonEvents = ButtonEvents;

export type PaginationPageEvents = ButtonEvents;

export type PaginationEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};
