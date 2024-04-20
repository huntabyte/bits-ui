<script lang="ts">
	import type { EscapeLayerProps } from "./types.js";
	import { useEscapeLayer } from "./use-escape-layer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let { behaviorType = "close", onEscape = noop, children, present }: EscapeLayerProps = $props();

	useEscapeLayer({
		behaviorType: readonlyBox(() => behaviorType),
		onEscape: readonlyBox(() => onEscape),
		present: readonlyBox(() => present),
	});
</script>

{@render children?.()}
