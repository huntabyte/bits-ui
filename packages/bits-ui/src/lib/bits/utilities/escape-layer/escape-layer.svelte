<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import { untrack } from "svelte";
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
		ref: untrack(() => ref),
	});
</script>

{@render children?.()}
