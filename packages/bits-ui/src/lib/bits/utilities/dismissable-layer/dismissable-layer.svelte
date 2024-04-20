<script lang="ts">
	import type { DismissableLayerProps } from "./types.js";
	import { useDismissableLayer } from "./use-dismissable-layer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let {
		behaviorType = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		id,
		children,
		present,
	}: DismissableLayerProps = $props();

	useDismissableLayer({
		id: readonlyBox(() => id),
		behaviorType: readonlyBox(() => behaviorType),
		onInteractOutside: readonlyBox(() => onInteractOutside),
		onInteractOutsideStart: readonlyBox(() => onInteractOutsideStart),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
