<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { useDateFieldInput } from "../date-field.svelte.js";
	import type { InputProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import DateFieldHiddenInput from "./date-field-hidden-input.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		asChild,
		children,
		child,
		...restProps
	}: InputProps = $props();

	const inputState = useDateFieldInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
