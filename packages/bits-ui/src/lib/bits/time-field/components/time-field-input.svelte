<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { TimeFieldInputState } from "../time-field.svelte.js";
	import type { TimeFieldInputProps } from "../types.js";
	import DateFieldHiddenInput from "./time-field-hidden-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		children,
		child,
		...restProps
	}: TimeFieldInputProps = $props();

	const inputState = TimeFieldInputState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		name: box.with(() => name),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
