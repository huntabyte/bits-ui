<script lang="ts">
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { type WritableBox, box } from "svelte-toolbelt";
	import { SelectRootState } from "../select.svelte.js";
	import type { SelectRootProps } from "../types.js";
	import SelectHiddenInput from "./select-hidden-input.svelte";
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
		allowDeselect = false,
		autocomplete,
		children,
	}: SelectRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? "" : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	let inputValue = $state("");

	const rootState = SelectRootState.create({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onValueChange(v as any);
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
		isCombobox: false,
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
			<SelectHiddenInput value={item} {autocomplete} />
		{/each}
	{/if}
{:else}
	<SelectHiddenInput bind:value={rootState.opts.value.current as string} {autocomplete} />
{/if}
