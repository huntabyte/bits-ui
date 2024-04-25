<script lang="ts">
	import type { EscapeLayerImplProps } from "./types.js";
	import { useEscapeLayer } from "./useEscapeLayer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let {
		behaviorType = "close",
		onEscapeKeydown = noop,
		children,
		present,
	}: EscapeLayerImplProps = $props();

	useEscapeLayer({
		behaviorType: readonlyBox(() => behaviorType),
		onEscapeKeydown: readonlyBox(() => onEscapeKeydown),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
