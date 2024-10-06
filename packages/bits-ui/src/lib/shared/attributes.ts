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

export type BitsHTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
export type BitsHTMLSpanAttributes = HTMLAttributes<HTMLSpanElement>;
export type BitsHTMLHeadingAttributes = HTMLAttributes<HTMLHeadingElement>;
export type BitsHTMLUListAttributes = HTMLAttributes<HTMLUListElement>;
export type BitsHTMLElementAttributes = HTMLAttributes<HTMLElement>;
export type BitsHTMLTableSectionAttributes = HTMLAttributes<HTMLTableSectionElement>;
export type BitsHTMLTableRowAttributes = HTMLAttributes<HTMLTableRowElement>;
export type BitsSVGElementAttributes = SVGAttributes<SVGElement>;

/**
 * We override the `id` prop type to not allow it to be `null`. We rely on the
 * `id` heavily in the internals of Bits UI for node references. We also override
 * children to allow for custom children snippet props. We extend `style` to allow
 * for either a `StyleProperties` object or a string of CSS properties.
 */
type BitsPrimitive<T> = Omit<T, "style" | "id" | "children"> & { id?: string };

export type BitsPrimitiveButtonAttributes = BitsPrimitive<HTMLButtonAttributes>;
export type BitsPrimitiveDivAttributes = BitsPrimitive<BitsHTMLDivAttributes>;
export type BitsPrimitiveInputAttributes = BitsPrimitive<HTMLInputAttributes>;
export type BitsPrimitiveSpanAttributes = BitsPrimitive<BitsHTMLSpanAttributes>;
export type BitsPrimitiveImgAttributes = BitsPrimitive<HTMLImgAttributes>;
export type BitsPrimitiveHeadingAttributes = BitsPrimitive<BitsHTMLHeadingAttributes>;
export type BitsPrimitiveLabelAttributes = BitsPrimitive<HTMLLabelAttributes>;
export type BitsPrimitiveSVGAttributes = BitsPrimitive<BitsSVGElementAttributes>;
export type BitsPrimitiveAnchorAttributes = BitsPrimitive<HTMLAnchorAttributes>;
export type BitsPrimitiveLiAttributes = BitsPrimitive<HTMLLiAttributes>;
export type BitsPrimitiveElementAttributes = BitsPrimitive<BitsHTMLElementAttributes>;
export type BitsPrimitiveUListAttributes = BitsPrimitive<BitsHTMLUListAttributes>;
export type BitsPrimitiveTdAttributes = BitsPrimitive<HTMLTdAttributes>;
export type BitsPrimitiveThAttributes = BitsPrimitive<HTMLThAttributes>;
export type BitsPrimitiveTableAttributes = BitsPrimitive<HTMLTableAttributes>;
export type BitsPrimitiveTbodyAttributes = BitsPrimitive<BitsHTMLTableSectionAttributes>;
export type BitsPrimitiveTrAttributes = BitsPrimitive<BitsHTMLTableRowAttributes>;
export type BitsPrimitiveTheadAttributes = BitsPrimitive<BitsHTMLTableSectionAttributes>;
export type BitsPrimitiveHeaderAttributes = BitsPrimitive<BitsHTMLElementAttributes>;
