import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useNodeById.svelte.js";

const ROOT_ATTR = "data-progress-root";

type ProgressRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: number | null;
		max: number;
	}>
>;

class ProgressRootState {
	#id: ProgressRootStateProps["id"];
	#ref: ProgressRootStateProps["ref"];
	#value: ProgressRootStateProps["value"];
	#max: ProgressRootStateProps["max"];

	constructor(props: ProgressRootStateProps) {
		this.#value = props.value;
		this.#max = props.max;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				role: "meter",
				value: this.#value.value,
				max: this.#max.value,
				"aria-valuemin": 0,
				"aria-valuemax": this.#max.value,
				"aria-valuenow": this.#value.value,
				"data-value": this.#value.value,
				"data-state": getProgressDataState(this.#value.value, this.#max.value),
				"data-max": this.#max.value,
				[ROOT_ATTR]: "",
			}) as const
	);
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

export function useProgressRootState(props: ProgressRootStateProps) {
	return new ProgressRootState(props);
}
