<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useListboxValue } from "../listbox.svelte.js";
	import type { ListboxValueProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		ref = $bindable(null),
		id = useId(),
		children,
		child,
		...restProps
	}: ListboxValueProps = $props();

	const valueState = useListboxValue({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, valueState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
