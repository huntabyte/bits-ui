<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useComboboxInput } from "../combobox.svelte.js";
	import type { InputProps } from "../index.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		child,
		...restProps
	}: InputProps = $props();

	const inputState = useComboboxInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => (value = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child?.({ props: mergedProps })}
	{:else}
		<input {...mergedProps} bind:value />
	{/if}
</FloatingLayer.Anchor>
