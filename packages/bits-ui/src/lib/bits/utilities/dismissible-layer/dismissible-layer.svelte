<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DismissibleLayerImplProps } from "./types.js";
	import { useDismissibleLayer } from "./useDismissibleLayer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		onFocusOutside = noop,
		id,
		children,
		enabled,
		isValidEvent = () => false,
	}: DismissibleLayerImplProps = $props();

	const dismissibleLayerState = useDismissibleLayer({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		onInteractOutside: box.with(() => onInteractOutside),
		onInteractOutsideStart: box.with(() => onInteractOutsideStart),
		enabled: box.with(() => enabled),
		onFocusOutside: box.with(() => onFocusOutside),
		isValidEvent: box.with(() => isValidEvent),
	});
</script>

{@render children?.({ props: dismissibleLayerState.props })}
