/**
 * https://github.com/mathiasbynens/CSS.escape
 *
 * @param value - The value to escape for use as a CSS identifier
 * @returns The escaped CSS identifier string
 */
export function cssEscape(value: string): string {
	if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
		return CSS.escape(value);
	}
	const length = value.length;
	let index = -1;
	let codeUnit: number;
	let result = "";
	const firstCodeUnit = value.charCodeAt(0);

	// If the character is the first character and is a `-` (U+002D), and
	// there is no second character, escape it
	if (length === 1 && firstCodeUnit === 0x002d) return "\\" + value;

	while (++index < length) {
		codeUnit = value.charCodeAt(index);

		// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD)
		if (codeUnit === 0x0000) {
			result += "\uFFFD";
			continue;
		}

		if (
			// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is U+007F
			(codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
			codeUnit === 0x007f ||
			// If the character is the first character and is in the range [0-9] (U+0030 to U+0039)
			(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
			// If the character is the second character and is in the range [0-9] (U+0030 to U+0039)
			// and the first character is a `-` (U+002D)
			(index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002d)
		) {
			// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
			result += "\\" + codeUnit.toString(16) + " ";
			continue;
		}

		// If the character is not handled by one of the above rules and is
		// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
		// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to U+005A),
		// or [a-z] (U+0061 to U+007A)
		if (
			codeUnit >= 0x0080 ||
			codeUnit === 0x002d ||
			codeUnit === 0x005f ||
			(codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
			(codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
			(codeUnit >= 0x0061 && codeUnit <= 0x007a)
		) {
			// Use the character itself
			result += value.charAt(index);
			continue;
		}

		// Otherwise, escape the character
		// https://drafts.csswg.org/cssom/#escape-a-character
		result += "\\" + value.charAt(index);
	}

	return result;
}
