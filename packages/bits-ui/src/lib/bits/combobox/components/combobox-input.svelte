<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ComboboxInputProps } from "../types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { useSelectInput } from "$lib/bits/select/select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		defaultValue,
		clearOnDeselect = false,
		...restProps
	}: ComboboxInputProps = $props();

	const inputState = useSelectInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		clearOnDeselect: box.with(() => clearOnDeselect),
	});

	if (defaultValue) {
		inputState.root.inputValue = defaultValue;
	}
</script>

<FloatingLayer.Anchor {id}>
	{#snippet anchor({ props: anchorProps })}
		{@const mergedProps = mergeProps(restProps, inputState.props, anchorProps, {
			value: inputState.root.inputValue,
		})}
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<input {...mergedProps} />
		{/if}
	{/snippet}
</FloatingLayer.Anchor>
