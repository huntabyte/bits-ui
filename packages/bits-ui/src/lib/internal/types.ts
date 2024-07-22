import type { Snippet } from "svelte";
import type {
	HTMLAnchorAttributes,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLImgAttributes,
	HTMLInputAttributes,
	HTMLLabelAttributes,
	HTMLLiAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes,
	SVGAttributes,
} from "svelte/elements";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "./box.svelte.js";
import type { StyleProperties } from "$lib/shared/index.js";

export type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
export type HTMLSpanAttributes = HTMLAttributes<HTMLSpanElement>;
export type HTMLHeadingAttributes = HTMLAttributes<HTMLHeadingElement>;
export type HTMLUListAttributes = HTMLAttributes<HTMLUListElement>;
export type HTMLElementAttributes = HTMLAttributes<HTMLElement>;
export type HTMLTableSectionAttributes = HTMLAttributes<HTMLTableSectionElement>;
export type HTMLTableRowAttributes = HTMLAttributes<HTMLTableRowElement>;
export type SVGElementAttributes = SVGAttributes<SVGElement>;

export type OnChangeFn<T> = (value: T) => void;

type Primitive<T> = Omit<T, "style" | "id" | "children"> & { id?: string };
export type PrimitiveButtonAttributes = Primitive<HTMLButtonAttributes>;
export type PrimitiveDivAttributes = Primitive<HTMLDivAttributes>;
export type PrimitiveInputAttributes = Primitive<HTMLInputAttributes>;
export type PrimitiveSpanAttributes = Primitive<HTMLSpanAttributes>;
export type PrimitiveImgAttributes = Primitive<HTMLImgAttributes>;
export type PrimitiveHeadingAttributes = Primitive<HTMLHeadingAttributes>;
export type PrimitiveLabelAttributes = Primitive<HTMLLabelAttributes>;
export type PrimitiveSVGAttributes = Primitive<SVGElementAttributes>;
export type PrimitiveAnchorAttributes = Primitive<HTMLAnchorAttributes>;
export type PrimitiveLiAttributes = Primitive<HTMLLiAttributes>;
export type PrimitiveElementAttributes = Primitive<HTMLElementAttributes>;
export type PrimitiveUListAttributes = Primitive<HTMLUListAttributes>;
export type PrimitiveTdAttributes = Primitive<HTMLTdAttributes>;
export type PrimitiveThAttributes = Primitive<HTMLThAttributes>;
export type PrimitiveTableAttributes = Primitive<HTMLTableAttributes>;
export type PrimitiveTbodyAttributes = Primitive<HTMLTableSectionAttributes>;
export type PrimitiveTrAttributes = Primitive<HTMLTableRowAttributes>;
export type PrimitiveTheadAttrbutes = Primitive<HTMLTableSectionAttributes>;
export type PrimitiveHeaderAttributes = Primitive<HTMLElementAttributes>;

export type ElementRef = Box<HTMLElement | null>;

export type WithChild<
	/**
	 * The props that the component accepts.
	 */
	Props extends Record<PropertyKey, unknown> = {},
	/**
	 * The props that are passed to the `child` and `children` snippets. The `ElementProps` are
	 * merged with these props for the `child` snippet.
	 */
	SnippetProps extends Record<PropertyKey, unknown> = { _default: never },
	/**
	 * The underlying DOM element being rendered. You can bind to this prop to
	 * programatically interact with the element.
	 */
	Ref = HTMLElement,
> = Omit<Props, "child" | "children"> & {
	child?: SnippetProps extends { _default: never }
		? Snippet<[{ props: Record<string, unknown> }]>
		: Snippet<[SnippetProps & { props: Record<string, unknown> }]>;
	children?: SnippetProps extends { _default: never } ? Snippet : Snippet<[SnippetProps]>;
	style?: StyleProperties;
	ref?: Ref | null;
};

export type WithChildren<Props = {}> = Props & {
	children?: Snippet;
};

/**
 * Constructs a new type by omitting properties from type
 * 'T' that exist in type 'U'.
 *
 * @template T - The base object type from which properties will be omitted.
 * @template U - The object type whose properties will be omitted from 'T'.
 * @example
 * type Result = Without<{ a: number; b: string; }, { b: string; }>;
 * // Result type will be { a: number; }
 */
export type Without<T extends object, U extends object> = Omit<T, keyof U>;

export type Arrayable<T> = T[] | T;

export type Fn = () => void;
// eslint-disable-next-line ts/no-explicit-any
export type AnyFn = (...args: any[]) => any;

export type WithRefProps<T = {}> = T &
	ReadableBoxedValues<{ id: string }> &
	WritableBoxedValues<{ ref: HTMLElement | null }>;
