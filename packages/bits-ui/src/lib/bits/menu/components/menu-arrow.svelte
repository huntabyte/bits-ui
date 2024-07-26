<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { useMenuArrow } from "../menu.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = useMenuArrow();

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<FloatingLayer.Arrow bind:ref {...mergedProps} />
