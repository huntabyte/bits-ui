import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type { WithoutChildren } from "svelte-toolbelt";
import type { WithChildren } from "$lib/shared/index.js";

export type ButtonPropsWithoutHTML = WithChildren<{
	ref?: HTMLElement | null;
}>;

type AnchorElement = ButtonPropsWithoutHTML &
	WithoutChildren<Omit<HTMLAnchorAttributes, "href">> & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	};

type ButtonElement = ButtonPropsWithoutHTML &
	WithoutChildren<Omit<HTMLButtonAttributes, "type">> & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	};

export type ButtonProps = AnchorElement | ButtonElement;
