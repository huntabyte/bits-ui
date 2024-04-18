<script lang="ts">
	import type { PreventTextSelectionOverflowLayerProps } from "./types.js";
	import { usePreventTextSelectionOverflowLayer } from "./prevent-text-selection-overflow-layer.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/index.js";

	let {
		enabled = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
	}: PreventTextSelectionOverflowLayerProps = $props();

	usePreventTextSelectionOverflowLayer({
		id: readonlyBox(() => id),
		enabled: readonlyBox(() => enabled),
		onPointerDown: readonlyBox(() => onPointerDown),
		onPointerUp: readonlyBox(() => onPointerUp),
	});
</script>

{@render children?.()}
