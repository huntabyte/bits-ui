<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useListboxItemText } from "../listbox.svelte.js";
	import type { ListboxItemTextProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		child,
		children,
		...restProps
	}: ListboxItemTextProps = $props();

	const itemTextState = useListboxItemText({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemTextState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
