<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxInputProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { ComboboxInputState, SelectContentContext } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		defaultValue,
		clearOnDeselect = false,
		...restProps
	}: ComboboxInputProps = $props();

	const contentState = SelectContentContext.getOr(null);

	const inputState = ComboboxInputState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			clearOnDeselect: boxWith(() => clearOnDeselect),
		},
		contentState
	);

	if (defaultValue) {
		inputState.root.opts.inputValue.current = defaultValue;
	}

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.root.opts.inputValue.current })
	);
</script>

{#if contentState}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input bind:this={inputState.opts.ref.current} {...mergedProps} />
	{/if}
{:else}
	<FloatingLayer.Anchor {id} ref={inputState.opts.ref}>
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<input {...mergedProps} />
		{/if}
	</FloatingLayer.Anchor>
{/if}
