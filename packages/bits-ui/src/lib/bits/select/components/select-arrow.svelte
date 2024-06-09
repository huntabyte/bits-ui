<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { useSelectArrow } from "../select.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { el = $bindable(), ...restProps }: ArrowProps = $props();

	const state = useSelectArrow();

	const mergedProps = $derived(mergeProps(restProps, state.props as any));
</script>

<FloatingLayer.Arrow bind:el {...mergedProps} />
