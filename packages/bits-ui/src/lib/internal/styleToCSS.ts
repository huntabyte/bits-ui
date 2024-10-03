function createParser(matcher: string | RegExp, replacer: (match: string) => string) {
	const regex = RegExp(matcher, "g");
	return (str: string): string => {
		// throw an error if not a string
		if (typeof str !== "string") {
			throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		}

		// if no match between string and matcher
		if (!str.match(regex)) return str;

		// executes the replacer function for each match
		return str.replace(regex, replacer);
	};
}

const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);

export function styleToCSS(styleObj: object) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
		throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	}
	return Object.keys(styleObj)
		.map(
			(property) =>
				`${camelToKebab(property)}: ${styleObj[property as keyof typeof styleObj]};`
		)
		.join("\n");
}
