export const asChild = {
	type: "boolean",
	default: "false",
	description: "Whether to use [render delegation](/docs/delegation) with this component or not."
};

export function portalProp(compName: string) {
	return {
		type: {
			type: "union",
			definition: union("string", "HTMLElement", "null", "undefined")
		},
		description: `Where to render the ${compName} when it is open. Defaults to the body. Can be disabled by passing \`null\``
	};
}

export const portal = {
	type: "union",
	definition: ""
};

export function union(...types: string[]): string {
	return types.join(" | ");
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}
