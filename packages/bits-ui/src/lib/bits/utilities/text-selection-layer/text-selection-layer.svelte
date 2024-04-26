<script lang="ts">
	import { box } from "runed";
	import type { TextSelectionLayerImplProps } from "./types.js";
	import { useTextSelectionLayer } from "./useTextSelectionLayer.svelte.js";
	import { noop } from "$lib/internal/index.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
		present,
	}: TextSelectionLayerImplProps = $props();

	useTextSelectionLayer({
		id: box.with(() => id),
		preventOverflowTextSelection: box.with(() => preventOverflowTextSelection),
		onPointerDown: box.with(() => onPointerDown),
		onPointerUp: box.with(() => onPointerUp),
		present: box.with(() => present),
	});
</script>

{@render children?.()}
