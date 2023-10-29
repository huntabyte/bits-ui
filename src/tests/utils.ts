import { kbd } from "$lib/internal/index.js";
import type { Matcher, MatcherOptions } from "@testing-library/svelte";

/**
 * A wrapper around the internal kbd object to make it easier to use in tests
 * which require the key names to be wrapped in curly braces.
 */
export type KbdKeys = keyof typeof kbd;
export const testKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce((acc, [key, value]) => {
	acc[key as KbdKeys] = `{${value}}`;
	return acc;
}, {} as Record<KbdKeys, string>);

export type queryByTestId = (
	id: Matcher,
	options?: MatcherOptions | undefined
) => HTMLElement | null;
