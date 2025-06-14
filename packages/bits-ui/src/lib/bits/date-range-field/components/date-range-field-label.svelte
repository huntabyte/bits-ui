<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { DateRangeFieldLabelState } from "../date-range-field.svelte.js";
	import type { DateRangeFieldLabelProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: DateRangeFieldLabelProps = $props();

	const labelState = DateRangeFieldLabelState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
