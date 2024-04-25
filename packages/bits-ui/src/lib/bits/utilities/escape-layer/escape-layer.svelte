<script lang="ts">
	import { box } from "runed";
	import type { EscapeLayerImplProps } from "./types.js";
	import { useEscapeLayer } from "./useEscapeLayer.svelte.js";
	import { noop } from "$lib/internal/index.js";

	let {
		behaviorType = "close",
		onEscapeKeydown = noop,
		children,
		present,
	}: EscapeLayerImplProps = $props();

	useEscapeLayer({
		behaviorType: box.with(() => behaviorType),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		present: box.with(() => present),
	});
</script>

{@render children?.()}
