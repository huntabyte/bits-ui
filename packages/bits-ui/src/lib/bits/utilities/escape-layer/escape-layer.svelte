<script lang="ts">
	import { box } from "runed";
	import type { EscapeLayerImplProps } from "./types.js";
	import { useEscapeLayer } from "./useEscapeLayer.svelte.js";
	import { noop } from "$lib/internal/index.js";

	let {
		escapeKeydownBehavior = "close",
		onEscapeKeydown = noop,
		children,
		present,
	}: EscapeLayerImplProps = $props();

	useEscapeLayer({
		escapeKeydownBehavior: box.with(() => escapeKeydownBehavior),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		present: box.with(() => present),
	});
</script>

{@render children?.()}
