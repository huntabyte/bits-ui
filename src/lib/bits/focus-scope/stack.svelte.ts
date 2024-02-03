interface FocusScopeAPI {
	paused: boolean;
	pause(): void;
	resume(): void;
}

const stack = $state<{ value: FocusScopeAPI[] }>({ value: [] });

export function createFocusScopeStack() {
	return {
		add(focusScope: FocusScopeAPI) {
			// pause the currently active focus scope (top of stack)
			const activeFocusScope = stack.value[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();

			// remove incase it's already in the stack as we'll re-add it to the top
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value.unshift(focusScope);
		},
		remove(focusScope: FocusScopeAPI) {
			stack.value = arrayRemove(stack.value, focusScope);
			stack.value[0]?.resume();
		},
	};
}

export function arrayRemove<T>(arr: T[], item: T) {
	const updatedArray = [...arr];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}

export function removeLinks(items: HTMLElement[]) {
	return items.filter((item) => item.tagName !== "A");
}
