import { attachRef } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const aspectRatioAttrs = createBitsAttrs({
	component: "aspect-ratio",
	parts: ["root"],
});

type AspectRatioRootStateProps = WithRefProps<ReadableBoxedValues<{ ratio: number }>>;

class AspectRatioRootState {
	readonly opts: AspectRatioRootStateProps;

	constructor(opts: AspectRatioRootStateProps) {
		this.opts = opts;
	}

	wrapperProps = $derived.by(() => ({
		style: {
			position: "relative",
			width: "100%",
			paddingBottom: `${this.opts.ratio.current ? 100 / this.opts.ratio.current : 0}%}`,
		},
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				[aspectRatioAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export function useAspectRatioRoot(props: AspectRatioRootStateProps) {
	return new AspectRatioRootState(props);
}
