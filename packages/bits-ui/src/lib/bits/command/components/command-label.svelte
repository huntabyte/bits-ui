<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import { useCommandLabel } from "../command.svelte.js";
	import type { PrimitiveLabelAttributes, WithElementRef } from "$lib/shared/index.js";
	import type { WithChildren } from "$lib/internal/types.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<PrimitiveLabelAttributes>> = $props();

	const labelState = useCommandLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

<label {...mergedProps}>
	{@render children?.()}
</label>
