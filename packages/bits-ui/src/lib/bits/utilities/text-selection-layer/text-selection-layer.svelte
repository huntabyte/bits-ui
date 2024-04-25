<script lang="ts">
	import type { TextSelectionLayerImplProps } from "./types.js";
	import { useTextSelectionLayer } from "./useTextSelectionLayer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let {
		preventOverflowTextSelection = true,
		onPointerDown = noop,
		onPointerUp = noop,
		id,
		children,
		present,
	}: TextSelectionLayerImplProps = $props();

	useTextSelectionLayer({
		id: readonlyBox(() => id),
		preventOverflowTextSelection: readonlyBox(() => preventOverflowTextSelection),
		onPointerDown: readonlyBox(() => onPointerDown),
		onPointerUp: readonlyBox(() => onPointerUp),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
