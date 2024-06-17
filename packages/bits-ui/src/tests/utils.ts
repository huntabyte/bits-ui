import type { Matcher, MatcherOptions } from "@testing-library/svelte";
import { getKbd, sleep } from "$lib/internal/index.js";
import { userEvent } from "@testing-library/user-event";

/**
 * A wrapper around the internal kbd object to make it easier to use in tests
 * which require the key names to be wrapped in curly braces.
 */
export type KbdKeys = keyof ReturnType<typeof getKbd>;

export function getTestKbd() {
	const kbd = getKbd();

	const initTestKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce(
		(acc, [key, value]) => {
			acc[key as KbdKeys] = `{${value}}`;
			return acc;
		},
		{} as Record<KbdKeys, string>
	);

	return {
		...initTestKbd,
		SHIFT_TAB: `{Shift>}{${kbd.TAB}}`,
	};
}

export type queryByTestId = (
	id: Matcher,
	options?: MatcherOptions | undefined
) => HTMLElement | null;

export function setupUserEvents() {
	const user = userEvent.setup({ pointerEventsCheck: 0 });
	const originalClick = user.click;
	const originalKeyboard = user.keyboard;
	const originalPointer = user.pointer;

	const click = async (element: HTMLElement) => {
		await originalClick(element);
		await sleep(20);
	};

	const keyboard = async (keys: string) => {
		await originalKeyboard(keys);
		await sleep(20);
	};

	const pointer: typeof originalPointer = async (input) => {
		await originalPointer(input);
		await sleep(20);
	};

	Object.assign(user, { click, keyboard, pointer });

	return user;
}
