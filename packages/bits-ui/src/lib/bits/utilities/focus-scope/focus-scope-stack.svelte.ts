import { useId } from "$lib/internal/useId.svelte.js";
import { box } from "svelte-toolbelt";

export type FocusScopeAPI = {
	id: string;
	paused: boolean;
	pause: () => void;
	resume: () => void;
};

const focusStack = box<FocusScopeAPI[]>([]);

export function createFocusScopeStack() {
	const stack = focusStack;

	return {
		add(focusScope: FocusScopeAPI) {
			// pause the currently active focus scope (top of the stack)
			const activeFocusScope = stack.value[0];
			if (focusScope !== activeFocusScope) {
				activeFocusScope?.pause();
			}

			// remove in case it already exists because it'll be added to the top
			stack.value = removeFromFocusScopeArray(stack.value, focusScope);
			stack.value.unshift(focusScope);
		},
		remove(focusScope: FocusScopeAPI) {
			stack.value = removeFromFocusScopeArray(stack.value, focusScope);
			stack.value[0]?.resume();
		},
	};
}

export function createFocusScopeAPI(): FocusScopeAPI {
	let paused = $state(false);

	return {
		id: useId(),
		get paused() {
			return paused;
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
	const updatedArr = [...arr].filter((i) => i.id !== item.id);
	return updatedArr;
}

export function removeLinks(items: HTMLElement[]) {
	return items.filter((item) => item.tagName !== "A");
}
