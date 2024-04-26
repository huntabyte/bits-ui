<script lang="ts">
	import { box } from "runed";
	import type { DismissableLayerImplProps } from "./types.js";
	import { useDismissableLayer } from "./useDismissableLayer.svelte.js";
	import { noop } from "$lib/internal/index.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		id,
		children,
		present,
	}: DismissableLayerImplProps = $props();

	useDismissableLayer({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		onInteractOutside: box.with(() => onInteractOutside),
		onInteractOutsideStart: box.with(() => onInteractOutsideStart),
		present: box.with(() => present),
	});
</script>

{@render children?.()}
