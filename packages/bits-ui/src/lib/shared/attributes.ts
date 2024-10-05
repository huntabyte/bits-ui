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

export type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
export type HTMLSpanAttributes = HTMLAttributes<HTMLSpanElement>;
export type HTMLHeadingAttributes = HTMLAttributes<HTMLHeadingElement>;
export type HTMLUListAttributes = HTMLAttributes<HTMLUListElement>;
export type HTMLElementAttributes = HTMLAttributes<HTMLElement>;
export type HTMLTableSectionAttributes = HTMLAttributes<HTMLTableSectionElement>;
export type HTMLTableRowAttributes = HTMLAttributes<HTMLTableRowElement>;
export type SVGElementAttributes = SVGAttributes<SVGElement>;

/**
 * We override the `id` prop type to not allow it to be `null`. We rely on the
 * `id` heavily in the internals of Bits UI for node references. We also override
 * children to allow for custom children snippet props. We extend `style` to allow
 * for either a `StyleProperties` object or a string of CSS properties.
 */
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
export type PrimitiveTheadAttributes = Primitive<HTMLTableSectionAttributes>;
export type PrimitiveHeaderAttributes = Primitive<HTMLElementAttributes>;
