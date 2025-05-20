<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useFloatingArrowState } from "../use-floating-layer.svelte.js";
	import { Arrow, type ArrowProps } from "$lib/bits/utilities/arrow/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = useFloatingArrowState({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
