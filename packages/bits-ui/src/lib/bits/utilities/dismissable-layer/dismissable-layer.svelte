<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DismissableLayerImplProps } from "./types.js";
	import { useDismissableLayer } from "./useDismissableLayer.svelte.js";
	import { noop } from "$lib/internal/index.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		onFocusOutside = noop,
		id,
		children,
		enabled,
		isValidEvent = () => false,
	}: DismissableLayerImplProps = $props();

	const dismissableLayerState = useDismissableLayer({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		onInteractOutside: box.with(() => onInteractOutside),
		onInteractOutsideStart: box.with(() => onInteractOutsideStart),
		enabled: box.with(() => enabled),
		onFocusOutside: box.with(() => onFocusOutside),
		isValidEvent: box.with(() => isValidEvent),
	});
</script>

{@render children?.({ props: dismissableLayerState.props })}
