import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type { WithChildren } from "$lib/shared/index.js";

export type ButtonPropsWithoutHTML = WithChildren<{
	ref?: HTMLElement | null;
}>;

type AnchorElement = ButtonPropsWithoutHTML &
	HTMLAnchorAttributes & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	};

type ButtonElement = ButtonPropsWithoutHTML &
	HTMLButtonAttributes & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	};

export type ButtonProps = AnchorElement | ButtonElement;
