<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputInputProps } from "../types.js";
	import { useTagsInputInput } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		controlledValue = false,
		onValueChange = noop,
		child,
		blurBehavior = "none",
		pasteBehavior = "add",
		...restProps
	}: TagsInputInputProps = $props();

	const inputState = useTagsInputInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		blurBehavior: box.with(() => blurBehavior),
		pasteBehavior: box.with(() => pasteBehavior),
	});

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.value.current })
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} bind:value={inputState.value.current} />
{/if}
