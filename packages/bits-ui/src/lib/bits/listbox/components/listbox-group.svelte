<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { GroupProps } from "../index.js";
	import { useListboxGroup } from "../listbox.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: GroupProps = $props();

	const groupState = useListboxGroup({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
