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
		present,
	}: DismissableLayerImplProps = $props();

	$inspect(onInteractOutsideStart);

	const state = useDismissableLayer({
		id: box.with(() => id),
		interactOutsideBehavior: box.with(() => interactOutsideBehavior),
		onInteractOutside: box.with(() => onInteractOutside),
		onInteractOutsideStart: box.with(() => onInteractOutsideStart),
		present: box.with(() => present),
		onFocusOutside: box.with(() => onFocusOutside),
	});
</script>

{@render children?.({ props: state.props })}
