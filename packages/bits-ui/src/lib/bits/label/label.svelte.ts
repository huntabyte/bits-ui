import { type ReadonlyBoxedValues, boxedState, readonlyBox } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";

type LabelRootStateProps = ReadonlyBoxedValues<{
	onmousedown: EventCallback<MouseEvent>;
}>;

class LabelRootState {
	#onmousedownProp = boxedState<LabelRootStateProps["onmousedown"]>(readonlyBox(() => () => {}));

	constructor(props: LabelRootStateProps) {
		this.#onmousedownProp.value = props.onmousedown;
	}

	#onmousedown = composeHandlers(this.#onmousedownProp, (e) => {
		if (e.detail > 1) e.preventDefault();
	});

	get props() {
		return {
			onmousedown: this.#onmousedown,
		};
	}
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
