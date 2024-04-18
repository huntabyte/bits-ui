import type { ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";

type LabelRootStateProps = ReadonlyBoxedValues<{
	onmousedown: EventCallback<MouseEvent>;
}>;

class LabelRootState {
	#composedMousedown: EventCallback<MouseEvent>;

	constructor(props: LabelRootStateProps) {
		this.#composedMousedown = composeHandlers(props.onmousedown, this.#onmousedown);
	}

	#onmousedown = (e: MouseEvent) => {
		if (e.detail > 1) e.preventDefault();
	};

	get props() {
		return {
			"data-label-root": "",
			onmousedown: this.#composedMousedown,
		};
	}
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
