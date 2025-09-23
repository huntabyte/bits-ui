<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
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
		ref,
	});
</script>

{@render children?.()}
