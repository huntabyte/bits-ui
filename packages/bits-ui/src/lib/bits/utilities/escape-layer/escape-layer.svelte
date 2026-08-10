<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
	import type { EscapeLayerImplProps } from "./types.js";
	import { EscapeLayerState } from "./use-escape-layer.svelte.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		escapeKeydownBehavior = "close",
		onEscapeKeydown = noop,
		children,
		enabled,
		ref,
	}: EscapeLayerImplProps = $props();

	EscapeLayerState.create({
		escapeKeydownBehavior: boxWith(() => escapeKeydownBehavior),
		onEscapeKeydown: boxWith(() => onEscapeKeydown),
		enabled: boxWith(() => enabled),
		// svelte-ignore state_referenced_locally
		ref,
	});
</script>

{@render children?.()}
