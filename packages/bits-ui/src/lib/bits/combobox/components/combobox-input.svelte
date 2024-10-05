<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ComboboxInputProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { useListboxInput } from "$lib/bits/listbox/listbox.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		defaultValue,
		...restProps
	}: ComboboxInputProps = $props();

	const inputState = useListboxInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	if (defaultValue) {
		inputState.root.inputValue = defaultValue;
	}

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.root.inputValue })
	);
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} />
	{/if}
</FloatingLayer.Anchor>
