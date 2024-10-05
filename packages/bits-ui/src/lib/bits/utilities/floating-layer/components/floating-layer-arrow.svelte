<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useFloatingArrowState } from "../useFloatingLayer.svelte.js";
	import { Arrow, type ArrowProps } from "$lib/bits/utilities/arrow/index.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = useFloatingArrowState({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	// explicit any here because the `asChild` and `child` are causing this to never out
	const mergedProps = $derived<any>(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
