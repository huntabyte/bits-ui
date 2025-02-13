import { useRefById } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const ASPECT_RATIO_ROOT_ATTR = "data-aspect-ratio-root";

type AspectRatioRootStateProps = WithRefProps<ReadableBoxedValues<{ ratio: number }>>;

class AspectRatioRootState {
	constructor(readonly opts: AspectRatioRootStateProps) {
		useRefById(opts);
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
				[ASPECT_RATIO_ROOT_ATTR]: "",
			}) as const
	);
}

export function useAspectRatioRoot(props: AspectRatioRootStateProps) {
	return new AspectRatioRootState(props);
}
