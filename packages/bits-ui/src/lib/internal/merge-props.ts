/**
 * A performance-tuned drop-in replacement for svelte-toolbelt's `mergeProps`.
 * `mergeProps` runs once per rendered component (per item in large lists), so
 * this version fast-paths the overwhelmingly common cases — plain value
 * overrides and string class merging — while preserving the exact semantics
 * of the original for handlers, class values, and styles.
 *
 * Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts
 * (see NOTICE.txt for source)
 */
import type { ClassValue } from "svelte/elements";
import { composeHandlers, cssToStyleObj, executeCallbacks, styleToString } from "svelte-toolbelt";

type Props = Record<string, unknown>;
type PropsArg = Props | null | undefined;
type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
	? NullToObject<V>
	: never;
type NullToObject<T> = T extends null | undefined ? object : T;
// oxlint-disable-next-line no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

/**
 * All lowercase DOM event handler attribute names — handlers for these are
 * composed (stop once `defaultPrevented`), other same-named functions chain.
 * Mirrors svelte-toolbelt's event list.
 */
const EVENT_LIST_SET = new Set([
	"onabort",
	"onanimationcancel",
	"onanimationend",
	"onanimationiteration",
	"onanimationstart",
	"onauxclick",
	"onbeforeinput",
	"onbeforetoggle",
	"onblur",
	"oncancel",
	"oncanplay",
	"oncanplaythrough",
	"onchange",
	"onclick",
	"onclose",
	"oncompositionend",
	"oncompositionstart",
	"oncompositionupdate",
	"oncontextlost",
	"oncontextmenu",
	"oncontextrestored",
	"oncopy",
	"oncuechange",
	"oncut",
	"ondblclick",
	"ondrag",
	"ondragend",
	"ondragenter",
	"ondragleave",
	"ondragover",
	"ondragstart",
	"ondrop",
	"ondurationchange",
	"onemptied",
	"onended",
	"onerror",
	"onfocus",
	"onfocusin",
	"onfocusout",
	"onformdata",
	"ongotpointercapture",
	"oninput",
	"oninvalid",
	"onkeydown",
	"onkeypress",
	"onkeyup",
	"onload",
	"onloadeddata",
	"onloadedmetadata",
	"onloadstart",
	"onlostpointercapture",
	"onmousedown",
	"onmouseenter",
	"onmouseleave",
	"onmousemove",
	"onmouseout",
	"onmouseover",
	"onmouseup",
	"onpaste",
	"onpause",
	"onplay",
	"onplaying",
	"onpointercancel",
	"onpointerdown",
	"onpointerenter",
	"onpointerleave",
	"onpointermove",
	"onpointerout",
	"onpointerover",
	"onpointerup",
	"onprogress",
	"onratechange",
	"onreset",
	"onresize",
	"onscroll",
	"onscrollend",
	"onsecuritypolicyviolation",
	"onseeked",
	"onseeking",
	"onselect",
	"onselectionchange",
	"onselectstart",
	"onslotchange",
	"onstalled",
	"onsubmit",
	"onsuspend",
	"ontimeupdate",
	"ontoggle",
	"ontouchcancel",
	"ontouchend",
	"ontouchmove",
	"ontouchstart",
	"ontransitioncancel",
	"ontransitionend",
	"ontransitionrun",
	"ontransitionstart",
	"onvolumechange",
	"onwaiting",
	"onwebkitanimationend",
	"onwebkitanimationiteration",
	"onwebkitanimationstart",
	"onwebkittransitionend",
	"onwheel",
]);

/** clsx-compatible check: can `value` be handled as a class value? */
function isClassValue(value: unknown): value is ClassValue {
	if (value === null || value === undefined) return true;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "bigint" || t === "boolean") return true;
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));
	if (t === "object") return Object.getPrototypeOf(value) === Object.prototype;
	return false;
}

/** Minimal clsx-equivalent for normalizing/merging class values. */
function classValueToString(value: ClassValue): string {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return String(value);
	if (typeof value === "boolean" || value === null || value === undefined) return "";
	if (Array.isArray(value)) {
		let out = "";
		for (const item of value) {
			const str = classValueToString(item as ClassValue);
			if (str) out = out ? `${out} ${str}` : str;
		}
		return out;
	}
	let out = "";
	for (const key in value) {
		if (value[key]) out = out ? `${out} ${key}` : key;
	}
	return out;
}

function mergeClass(a: unknown, b: unknown): unknown {
	// fast path: both plain strings (the common case by far)
	if (typeof a === "string") {
		if (typeof b === "string") return a && b ? `${a} ${b}` : a || b;
		if (b === null || b === undefined) return a;
	}
	const aIsClassValue = isClassValue(a);
	const bIsClassValue = isClassValue(b);
	if (aIsClassValue && bIsClassValue) {
		const aStr = classValueToString(a as ClassValue);
		const bStr = classValueToString(b as ClassValue);
		return aStr && bStr ? `${aStr} ${bStr}` : aStr || bStr;
	}
	if (aIsClassValue) return classValueToString(a as ClassValue);
	if (bIsClassValue) return classValueToString(b as ClassValue);
	// neither is a mergeable class value — keep the original
	return a;
}

function mergeStyle(a: unknown, b: unknown): unknown {
	const aIsObject = typeof a === "object";
	const bIsObject = typeof b === "object";
	const aIsString = typeof a === "string";
	const bIsString = typeof b === "string";
	if (aIsObject && bIsObject) return { ...a, ...b };
	if (aIsObject && bIsString) return { ...a, ...cssToStyleObj(b as string) };
	if (aIsString && bIsObject) return { ...cssToStyleObj(a as string), ...b };
	if (aIsString && bIsString)
		return { ...cssToStyleObj(a as string), ...cssToStyleObj(b as string) };
	if (aIsObject) return a;
	if (bIsObject) return b;
	if (aIsString) return a;
	if (bIsString) return b;
	return a;
}

/**
 * Given a list of prop objects, merges them into a single object.
 * - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
 * - Chains regular functions with the same name so they are called in order
 * - Merges class values (strings, arrays, objects)
 * - Merges style objects and converts them to strings
 * - Handles a bug with Svelte where setting the `hidden`/`disabled` attribute to
 *   `false` doesn't remove it
 * - Overrides other values with the last one
 */
export function mergeProps<T extends PropsArg[]>(
	...args: T
): UnionToIntersection<TupleTypes<T>> & { style?: string } {
	const result: Props = { ...args[0] };

	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		if (!props) continue;

		for (const key of Object.keys(props)) {
			const b = props[key];
			const a = result[key];

			if (a === undefined) {
				// nothing to merge with — the only keys that still need
				// normalization are non-string class values and `style` strings
				// (both handled below); everything else is a plain override.
				if (key === "class") {
					result[key] = typeof b === "string" ? b : mergeClass(undefined, b);
				} else {
					result[key] = b;
				}
				continue;
			}

			const aIsFunction = typeof a === "function";
			const bIsFunction = typeof b === "function";

			if (aIsFunction && bIsFunction && EVENT_LIST_SET.has(key)) {
				// compose event handlers
				result[key] = composeHandlers(
					a as (...args: unknown[]) => unknown,
					b as (...args: unknown[]) => unknown
				);
			} else if (aIsFunction && bIsFunction) {
				// chain non-event handler functions
				result[key] = executeCallbacks(a, b);
			} else if (key === "class") {
				result[key] = mergeClass(a, b);
			} else if (key === "style") {
				result[key] = mergeStyle(a, b);
			} else {
				result[key] = b !== undefined ? b : a;
			}
		}

		// handle symbol keys (mostly for `Attachments`)
		const symbols = Object.getOwnPropertySymbols(props);
		for (const key of symbols) {
			const b = (props as Record<symbol, unknown>)[key];
			result[key as unknown as string] =
				b !== undefined ? b : result[key as unknown as string];
		}
	}

	// convert style object to string
	if (typeof result.style === "object" && result.style !== null) {
		result.style = styleToString(result.style as Record<string, string>).replaceAll("\n", " ");
	}

	// handle weird svelte bug where `hidden` is not removed when set to `false`
	if (result.hidden === false) {
		delete result.hidden;
	}
	// handle weird svelte bug where `disabled` is not removed when set to `false`
	if (result.disabled === false) {
		delete result.disabled;
	}

	return result as UnionToIntersection<TupleTypes<T>> & { style?: string };
}
