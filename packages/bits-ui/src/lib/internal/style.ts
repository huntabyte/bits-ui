import type { StyleProperties } from "$lib/shared/index.js";

export function styleToString(style: StyleProperties = {}): string {
	let styleString = "";
	for (const key in style) {
		const value = style[key as keyof StyleProperties];
		if (value === undefined) continue;
		styleString += `${key}:${value};`;
	}
	return styleString;
}

export const srOnlyStyles: StyleProperties = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	"white-space": "nowrap",
	"border-width": "0",
};
