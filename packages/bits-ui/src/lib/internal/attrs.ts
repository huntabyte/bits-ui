export function boolToStr(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function boolToStrTrueOrUndef(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function boolToEmptyStrOrUndef(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function boolToTrueOrUndef(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function getDataChecked(condition: boolean): "checked" | "unchecked" {
	return condition ? "checked" : "unchecked";
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
