<script lang="ts">
	import type { EscapeLayerProps } from "./types.js";
	import { escapeLayerState } from "./escape-layer.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/index.js";

	let { behaviorType = "close", onEscape = noop, children }: EscapeLayerProps = $props();

	escapeLayerState({
		behaviorType: readonlyBox(() => behaviorType),
		onEscape: readonlyBox(() => onEscape),
	});
</script>

{@render children?.()}
