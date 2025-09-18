function boolToStr(): (condition: boolean) => "true" | "false" {
	return (condition: boolean) => (condition ? "true" : "false");
}

function boolToTrueOrUndefined(): (condition: boolean) => "true" | undefined {
	return (condition: boolean) => (condition ? "true" : undefined);
}

function boolToEmptyOrUndefined(): (condition: boolean) => "" | undefined {
	return (condition: boolean) => (condition ? "" : undefined);
}

export function getOrientation(orientation: "horizontal" | "vertical"): "horizontal" | "vertical" {
	return orientation;
}

export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function getDataChecked(condition: boolean): "checked" | "unchecked" {
	return condition ? "checked" : "unchecked";
}

export const getAriaDisabled = boolToStr();
export const getAriaReadonly = boolToStr();
export const getAriaExpanded = boolToStr();
export const getAriaRequired = boolToStr();
export const getAriaSelected = boolToStr();
export const getAriaHidden = boolToTrueOrUndefined();
export const getAriaInvalid = boolToTrueOrUndefined();
export const getAriaPressed = boolToStr();

export function getAriaChecked(
	checked: boolean,
	indeterminate: boolean
): "true" | "false" | "mixed" {
	if (indeterminate) {
		return "mixed";
	}
	return checked ? "true" : "false";
}

export const getDataRequired = boolToEmptyOrUndefined();
export const getDataInvalid = boolToEmptyOrUndefined();
export const getDataReadonly = boolToEmptyOrUndefined();
export const getDataSelected = boolToEmptyOrUndefined();
export const getDataUnavailable = boolToEmptyOrUndefined();
export const getDataDisabled = boolToEmptyOrUndefined();

export const getHidden = boolToTrueOrUndefined();
export const getDisabled = boolToTrueOrUndefined();
export const getRequired = boolToTrueOrUndefined();

export type BitsAttrsConfig<T extends readonly string[]> = {
	component: string;
	parts: T;
	getVariant?: () => string | null;
};

export type CreateBitsAttrsReturn<T extends readonly string[]> = {
	[K in T[number]]: string;
} & {
	selector: (part: T[number]) => string;
	getAttr: (part: T[number], variant?: string) => string;
};

export class BitsAttrs<T extends readonly string[]> {
	readonly #variant: string | null;
	readonly #prefix: string;
	attrs: Record<T[number], string>;

	constructor(config: BitsAttrsConfig<T>) {
		this.#variant = config.getVariant ? config.getVariant() : null;
		this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config.component}-`;

		this.getAttr = this.getAttr.bind(this);
		this.selector = this.selector.bind(this);

		this.attrs = Object.fromEntries(
			config.parts.map((part) => [part, this.getAttr(part)])
		) as Record<T[number], string>;
	}

	getAttr(part: T[number], variantOverride?: string): string {
		if (variantOverride) return `data-${variantOverride}-${part}`;
		return `${this.#prefix}${part}`;
	}

	selector(part: T[number], variantOverride?: string): string {
		return `[${this.getAttr(part, variantOverride)}]`;
	}
}

export function createBitsAttrs<const T extends readonly string[]>(
	config: Omit<BitsAttrsConfig<T>, "parts"> & { parts: T }
): CreateBitsAttrsReturn<T> {
	const bitsAttrs = new BitsAttrs(config);

	return {
		...bitsAttrs.attrs,
		selector: bitsAttrs.selector,
		getAttr: bitsAttrs.getAttr,
	} as CreateBitsAttrsReturn<T>;
}
