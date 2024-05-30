import { box } from "svelte-toolbelt";

export type FocusScopeAPI = {
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
			stack.value = removeFromArray($state.snapshot(stack.value), focusScope);
			stack.value.unshift(focusScope);
		},
		remove(focusScope: FocusScopeAPI) {
			stack.value = removeFromArray($state.snapshot(stack.value), focusScope);
			stack.value[0]?.resume();
		},
	};
}

export function createFocusScopeAPI(): FocusScopeAPI {
	let paused = $state(false);

	return {
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

export function removeFromArray<T>(arr: T[], item: T) {
	const updatedArr = [...arr];
	const index = updatedArr.indexOf(item);
	if (index !== -1) updatedArr.splice(index, 1);
	return updatedArr;
}

export function removeLinks(items: HTMLElement[]) {
	return items.filter((item) => item.tagName !== "A");
}
