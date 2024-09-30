<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { InputProps } from "../index.js";
	import { useTagsInputInput } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		child,
		...restProps
	}: InputProps = $props();

	const inputState = useTagsInputInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props, { value }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} />
{/if}
