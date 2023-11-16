export function union(...types: string[]): string {
	return types.join(" | ");
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}
