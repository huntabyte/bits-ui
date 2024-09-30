<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { InputProps } from "../index.js";
	import { useTagsInputInput } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		controlledValue = false,
		onValueChange = noop,
		child,
		...restProps
	}: InputProps = $props();

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
