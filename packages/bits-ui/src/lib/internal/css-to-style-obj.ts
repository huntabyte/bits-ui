import parse from "style-to-object";
import { camelCase } from "scule";
import type { StyleProperties } from "$lib/shared/index.js";

export function cssToStyleObj(css: string): StyleProperties {
	if (!css) return {};
	const styleObj: Record<string, unknown> = {};

	function iterator(name: string, value: string) {
		styleObj[camelCase(name)] = value;
	}

	parse(css, iterator);

	return styleObj;
}
