export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function getDataChecked(condition: boolean): "checked" | "unchecked" {
	return condition ? "checked" : "unchecked";
}

export function getAriaDisabled(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaReadonly(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaExpanded(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getDataDisabled(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getAriaRequired(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaSelected(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaChecked(
	checked: boolean,
	indeterminate: boolean
): "true" | "false" | "mixed" {
	if (indeterminate) {
		return "mixed";
	}
	return checked ? "true" : "false";
}

export function getAriaOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getAriaHidden(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getAriaInvalid(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getDataOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getDataInvalid(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataRequired(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataReadonly(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataSelected(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataUnavailable(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getHidden(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getDisabled(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getAriaPressed(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getRequired(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

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
