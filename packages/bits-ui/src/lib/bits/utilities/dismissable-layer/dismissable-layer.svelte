<script lang="ts">
	import type { DismissableLayerProps } from "./types.js";
	import { useDismissableLayer } from "./dismissable-layer.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/index.js";

	let {
		behaviorType = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		id,
		children,
	}: DismissableLayerProps = $props();

	useDismissableLayer({
		id: readonlyBox(() => id),
		behaviorType: readonlyBox(() => behaviorType),
		onInteractOutside: readonlyBox(() => onInteractOutside),
		onInteractOutsideStart: readonlyBox(() => onInteractOutsideStart),
	});
</script>

{@render children?.()}
