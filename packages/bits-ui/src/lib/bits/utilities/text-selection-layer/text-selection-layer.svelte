<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TextSelectionLayerImplProps } from "./types.js";
	import { TextSelectionLayerState } from "./use-text-selection-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
		enabled,
		ref,
	}: TextSelectionLayerImplProps = $props();

	TextSelectionLayerState.create({
		id: box.with(() => id),
		onPointerDown: box.with(() => onPointerDown),
		onPointerUp: box.with(() => onPointerUp),
		enabled: box.with(() => enabled && preventOverflowTextSelection),
		ref,
	});
</script>

{@render children?.()}
