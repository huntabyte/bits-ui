import type { ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";

type ProgressRootStateProps = ReadonlyBoxedValues<{
	value: number | null;
	max: number;
}>;

class ProgressRootState {
	#value: ProgressRootStateProps["value"];
	#max: ProgressRootStateProps["max"];

	constructor(props: ProgressRootStateProps) {
		this.#value = props.value;
		this.#max = props.max;
	}

	get props() {
		return {
			role: "meter",
			value: this.#value.value,
			max: this.#max.value,
			"aria-valuemin": 0,
			"aria-valuemax": this.#max.value,
			"aria-valuenow": this.#value.value,
			"data-value": this.#value.value,
			"data-state": getProgressDataState(this.#value.value, this.#max.value),
			"data-max": this.#max.value,
			"data-progress-root": "",
		} as const;
	}
}

//
// HELPERS
//

function getProgressDataState(
	value: number | null,
	max: number
): "indeterminate" | "loaded" | "loading" {
	if (value === null) return "indeterminate";
	return value === max ? "loaded" : "loading";
}

//
// STATE PROVIDERS
//

export function setProgressRootState(props: ProgressRootStateProps) {
	return new ProgressRootState(props);
}
