<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectGroupProps } from "../types.js";
	import { useSelectGroup } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: SelectGroupProps = $props();

	const groupState = useSelectGroup({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
