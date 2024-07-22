<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useComboboxGroup } from "../combobox.svelte.js";
	import type { GroupProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: GroupProps = $props();

	const groupState = useComboboxGroup({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
