export function styleToString(style: Record<string, number | string | undefined>): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + `${key}:${style[key]};`;
	}, "");
}

export const srOnlyStyles = styleToString({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0"
});

export const hiddenInputStyles = styleToString({
	position: "absolute",
	width: "25px",
	height: "25px",
	opacity: "0",
	margin: "0px",
	pointerEvents: "none",
	transform: "translateX(-100%)"
});
