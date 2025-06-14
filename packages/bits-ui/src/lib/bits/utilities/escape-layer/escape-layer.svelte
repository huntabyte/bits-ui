<script lang="ts">
	import { box } from "svelte-toolbelt";
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
		escapeKeydownBehavior: box.with(() => escapeKeydownBehavior),
		onEscapeKeydown: box.with(() => onEscapeKeydown),
		enabled: box.with(() => enabled),
		ref,
	});
</script>

{@render children?.()}
