import { createEventDispatcher } from "svelte";

type MeltEvent<T extends Event = Event> = {
	detail: {
		originalEvent: T;
	};
	cancelable: boolean;
	preventDefault: () => void;
};

export function createDispatcher<M extends Element = Element>() {
	const dispatch = createEventDispatcher();
	return (e: MeltEvent) => {
		const { originalEvent } = e.detail;
		const { cancelable } = e;

		const type = originalEvent.type;

		const shouldContinue = dispatch(
			type,
			{ originalEvent, currentTarget: originalEvent.currentTarget as M },
			{ cancelable }
		);
		if (!shouldContinue) {
			e.preventDefault();
		}
	};
}

export type CreateDispatcher = {
	createDispatcher: typeof createDispatcher;
};
