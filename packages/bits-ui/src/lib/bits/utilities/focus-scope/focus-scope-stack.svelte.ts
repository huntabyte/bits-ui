import { box } from "svelte-toolbelt";
import { useId } from "$lib/internal/use-id.js";

export interface FocusScopeAPI {
	id: string;
	paused: boolean;
	pause: () => void;
	resume: () => void;
	isHandlingFocus: boolean;
}
const focusStack = box<FocusScopeAPI[]>([]);

export function createFocusScopeStack() {
	return {
		add(focusScope: FocusScopeAPI) {
			const activeFocusScope = focusStack.current[0];
			if (activeFocusScope && focusScope.id !== activeFocusScope.id) {
				activeFocusScope.pause();
			}

			focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
			focusStack.current.unshift(focusScope);
		},
		remove(focusScope: FocusScopeAPI) {
			focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
			focusStack.current[0]?.resume();
		},
		get current() {
			return focusStack.current;
		},
	};
}

export function createFocusScopeAPI(): FocusScopeAPI {
	let paused = $state(false);
	let isHandlingFocus = $state(false);

	return {
		id: useId(),
		get paused() {
			return paused;
		},
		get isHandlingFocus() {
			return isHandlingFocus;
		},
		set isHandlingFocus(value: boolean) {
			isHandlingFocus = value;
		},
		pause() {
			paused = true;
		},
		resume() {
			paused = false;
		},
	};
}

function removeFromFocusScopeArray(arr: FocusScopeAPI[], item: FocusScopeAPI) {
	return [...arr].filter((i) => i.id !== item.id);
}

export function removeLinks(items: HTMLElement[]) {
	return items.filter((item) => item.tagName !== "A");
}
