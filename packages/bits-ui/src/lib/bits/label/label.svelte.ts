import type { ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";

type LabelRootStateProps = ReadonlyBoxedValues<{
	onmousedown: EventCallback<MouseEvent>;
}>;

class LabelRootState {
	#composedMousedown = undefined as unknown as EventCallback<MouseEvent>;
	props = $derived({
		"data-label-root": "",
		onmousedown: this.#composedMousedown,
	});

	constructor(props: LabelRootStateProps) {
		this.#composedMousedown = composeHandlers(props.onmousedown, this.#onmousedown);
	}

	#onmousedown = (e: MouseEvent) => {
		if (e.detail > 1) e.preventDefault();
	};
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
