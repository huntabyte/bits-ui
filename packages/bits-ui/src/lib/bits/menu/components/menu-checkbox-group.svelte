<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuCheckboxGroupProps } from "../types.js";
	import { MenuCheckboxGroupState } from "../menu.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = noop,
		...restProps
	}: MenuCheckboxGroupProps = $props();

	const checkboxGroupState = MenuCheckboxGroupState.create({
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
