<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CheckboxGroupProps } from "../types.js";
	import { CheckboxGroupState } from "../checkbox.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";
	import { arraysAreEqual } from "$lib/internal/arrays.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		value = $bindable([]),
		onValueChange = noop,
		name,
		required,
		disabled,
		children,
		child,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = CheckboxGroupState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
		required: box.with(() => Boolean(required)),
		name: box.with(() => name),
		value: box.with(
			() => $state.snapshot(value),
			(v) => {
				if (arraysAreEqual(value, v)) return;
				value = $state.snapshot(v);
				onValueChange(v);
			}
		),
		onValueChange: box.with(() => onValueChange),
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
