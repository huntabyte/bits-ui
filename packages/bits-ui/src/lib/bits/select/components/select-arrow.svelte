<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectArrowProps } from "../types.js";
	import { useSelectArrow } from "../select.svelte.js";
	import FloatingLayerArrow from "$lib/bits/utilities/floating-layer/components/floating-layer-arrow.svelte";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: SelectArrowProps = $props();

	const arrowState = useSelectArrow({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<FloatingLayerArrow {...mergedProps} />
