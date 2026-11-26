<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { untrack } from "svelte";
	import type { ComboboxInputProps } from "../types.js";
	import { createId } from "#lib/internal/create-id.js";
	import { FloatingLayer } from "#lib/bits/utilities/floating-layer/index.js";
	import { SelectInputState } from "#lib/bits/select/select.svelte.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		defaultValue,
		clearOnDeselect = false,
		clearInputOnSelect = false,
		removeOnBackspace = false,
		...restProps
	}: ComboboxInputProps = $props();

	const inputState = SelectInputState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		clearOnDeselect: boxWith(() => clearOnDeselect),
		clearInputOnSelect: boxWith(() => clearInputOnSelect),
		removeOnBackspace: boxWith(() => removeOnBackspace),
	});

	untrack(() => {
		if (defaultValue) {
			inputState.root.opts.inputValue.current = defaultValue;
		}
	});

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.root.opts.inputValue.current })
	);
</script>

<FloatingLayer.Anchor {id} ref={inputState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} />
	{/if}
</FloatingLayer.Anchor>
