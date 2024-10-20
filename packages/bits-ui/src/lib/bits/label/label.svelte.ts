import { useRefById } from "svelte-toolbelt";
import type { WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-label-root";

type LabelRootStateProps = WithRefProps;
class LabelRootState {
	#id: LabelRootStateProps["id"];
	#ref: LabelRootStateProps["ref"];
	constructor(props: LabelRootStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onmousedown = (e: MouseEvent) => {
		if (e.detail > 1) e.preventDefault();
	};

	props = $derived({
		[ROOT_ATTR]: "",
		onmousedown: this.#onmousedown,
	});
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
