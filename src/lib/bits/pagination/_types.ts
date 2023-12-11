/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { AsChild, Expand, OnChangeFn } from "$lib/internal";
import type { CreatePaginationProps, Page } from "@melt-ui/svelte";

type OmitPaginationProps<T> = Omit<T, "page" | "defaultPage" | "onPageChange">;

type Props = Expand<
	OmitPaginationProps<CreatePaginationProps> & {
		/**
		 * The selected page. This updates as the users selects new pages.
		 *
		 * You can bind this to a value to programmatically control the value state.
		 */
		page?: number;

		/**
		 * A callback function called when the page changes.
		 */
		onPageChange?: OnChangeFn<number>;
	} & AsChild
>;

type PageProps = {
	page: Page;
} & AsChild;

type PrevButtonProps = AsChild;

type NextButtonProps = AsChild;

export type { Props, PrevButtonProps, NextButtonProps, PageProps };
