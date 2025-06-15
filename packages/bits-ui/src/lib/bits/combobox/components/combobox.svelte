<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { ComboboxRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { SelectRootState } from "$lib/bits/select/select.svelte.js";
	import ListboxHiddenInput from "$lib/bits/select/components/select-hidden-input.svelte";
	import { watch } from "runed";

	let {
		value = $bindable(),
		onValueChange = noop,
		name = "",
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		loop = false,
		scrollAlignment = "nearest",
		required = false,
		items = [],
		allowDeselect = true,
		inputValue = "",
		children,
	}: ComboboxRootProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		value = defaultValue;
	}

	watch.pre(
		() => value,
		() => {
			if (value !== undefined) return;
			value = type === "single" ? "" : [];
		}
	);

	const rootState = SelectRootState.create({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		loop: box.with(() => loop),
		scrollAlignment: box.with(() => scrollAlignment),
		name: box.with(() => name),
		isCombobox: true,
		items: box.with(() => items),
		allowDeselect: box.with(() => allowDeselect),
		inputValue: box.with(
			() => inputValue,
			(v) => (inputValue = v)
		),
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>

{#if Array.isArray(rootState.opts.value.current)}
	{#if rootState.opts.value.current.length}
		{#each rootState.opts.value.current as item (item)}
			<ListboxHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<ListboxHiddenInput bind:value={rootState.opts.value.current as string} />
{/if}
