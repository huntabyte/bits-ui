<script lang="ts">
	import type { DismissableLayerImplProps } from "./types.js";
	import { useDismissableLayer } from "./useDismissableLayer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let {
		interactOutsideBehavior = "close",
		onInteractOutside = noop,
		onInteractOutsideStart = noop,
		id,
		children,
		present,
	}: DismissableLayerImplProps = $props();

	useDismissableLayer({
		id: readonlyBox(() => id),
		interactOutsideBehavior: readonlyBox(() => interactOutsideBehavior),
		onInteractOutside: readonlyBox(() => onInteractOutside),
		onInteractOutsideStart: readonlyBox(() => onInteractOutsideStart),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
