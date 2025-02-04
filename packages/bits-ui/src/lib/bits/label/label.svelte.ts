import { useRefById } from "svelte-toolbelt";
import type { BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-label-root";

type LabelRootStateProps = WithRefProps;
class LabelRootState {
	constructor(readonly opts: LabelRootStateProps) {
		this.onmousedown = this.onmousedown.bind(this);

		useRefById(opts);
	}

	onmousedown(e: BitsMouseEvent) {
		if (e.detail > 1) e.preventDefault();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[ROOT_ATTR]: "",
				onmousedown: this.onmousedown,
			}) as const
	);
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
