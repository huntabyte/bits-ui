<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuCheckboxGroupProps } from "../types.js";
	import { useMenuCheckboxGroup } from "../menu.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = noop,
		...restProps
	}: MenuCheckboxGroupProps = $props();

	const checkboxGroupState = useMenuCheckboxGroup({
		value: box.with(
			() => $state.snapshot(value),
			(v) => {
				value = $state.snapshot(v);
				onValueChange(v);
			}
		),
		onValueChange: box.with(() => onValueChange),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, checkboxGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
