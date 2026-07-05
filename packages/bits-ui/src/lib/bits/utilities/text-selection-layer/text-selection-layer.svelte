<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
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
		id: boxWith(() => id),
		onPointerDown: boxWith(() => onPointerDown),
		onPointerUp: boxWith(() => onPointerUp),
		enabled: boxWith(() => enabled && preventOverflowTextSelection),
		// svelte-ignore state_referenced_locally
		ref,
	});
</script>

{@render children?.()}
