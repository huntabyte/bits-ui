import type { Bit } from "@/content/api-reference/index.js";

export function createBitAttrs<T extends readonly string[]>(bit: Bit | "menu", parts: T) {
	const attrs: Record<string, Record<string, string>> = {};
	parts.forEach((part) => {
		attrs[part] = {
			[`data-${bit}-${part}`]: ""
		};
	});

	return (part: T[number]) => attrs[part];
}

export function disabledAttrs(disabled: boolean | undefined | null) {
	return disabled
		? { "aria-disabled": "true", "data-disabled": "" }
		: { "aria-disabled": undefined, "data-disabled": undefined };
}
