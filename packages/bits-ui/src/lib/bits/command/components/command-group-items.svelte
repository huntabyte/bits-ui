<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { GroupItemsProps } from "../index.js";
	import { useCommandGroupItems } from "../command.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: GroupItemsProps = $props();

	const groupItemsState = useCommandGroupItems({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemsState.props));
</script>

<div style="display: contents;">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
