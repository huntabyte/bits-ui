<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		readonly,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = CheckboxGroupState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
		required: boxWith(() => Boolean(required)),
		readonly: boxWith(() => Boolean(readonly)),
		name: boxWith(() => name),
		value: boxWith(
			() => $state.snapshot(value),
			(v) => {
				if (arraysAreEqual(value, v)) return;
				value = $state.snapshot(v);
				onValueChange(v);
			}
		),
		onValueChange: boxWith(() => onValueChange),
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
