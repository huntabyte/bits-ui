<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { FloatingArrowState } from "../use-floating-layer.svelte.js";
	import { Arrow, type ArrowProps } from "#lib/bits/utilities/arrow/index.js";
	import { createId } from "#lib/internal/create-id.js";

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = FloatingArrowState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
