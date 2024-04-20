<script lang="ts">
	import type { TextSelectionLayerProps } from "./types.js";
	import { useTextSelectionLayer } from "./use-text-selection-layer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let {
		enabled = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
		present,
	}: TextSelectionLayerProps = $props();

	useTextSelectionLayer({
		id: readonlyBox(() => id),
		enabled: readonlyBox(() => enabled),
		onPointerDown: readonlyBox(() => onPointerDown),
		onPointerUp: readonlyBox(() => onPointerUp),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
