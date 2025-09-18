<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import type { DismissibleLayerImplProps } from "./types.js";
	import { DismissibleLayerState } from "./use-dismissable-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onFocusOutside = noop,
		id,
		children,
		enabled,
		isValidEvent = () => false,
		ref,
	}: DismissibleLayerImplProps = $props();

	const dismissibleLayerState = DismissibleLayerState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		onInteractOutside: boxWith(() => onInteractOutside),
		enabled: boxWith(() => enabled),
		onFocusOutside: boxWith(() => onFocusOutside),
		isValidEvent: boxWith(() => isValidEvent),
		ref,
	});
</script>

{@render children?.({ props: dismissibleLayerState.props })}
