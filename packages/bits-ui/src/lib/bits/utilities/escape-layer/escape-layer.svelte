<script lang="ts">
	import type { EscapeLayerProps } from "./types.js";
	import { useEscapeLayer } from "./escape-layer.svelte.js";
	import { noop, readonlyBox } from "$lib/internal/index.js";

	let { behaviorType = "close", onEscape = noop, children }: EscapeLayerProps = $props();

	useEscapeLayer({
		behaviorType: readonlyBox(() => behaviorType),
		onEscape: readonlyBox(() => onEscape),
	});
</script>

{@render children?.()}
