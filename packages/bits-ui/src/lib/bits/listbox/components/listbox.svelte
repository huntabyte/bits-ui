<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { useListboxRoot } from "../listbox.svelte.js";
	import type { ListboxRootProps } from "../types.js";
	import ListboxHiddenInput from "./listbox-hidden-input.svelte";
	import { noop } from "$lib/internal/noop.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";

	let {
		value = $bindable(),
		onValueChange = noop,
		name = "",
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = noop,
		loop = false,
		scrollAlignment = "nearest",
		required = false,
		controlledOpen = false,
		controlledValue = false,
		items = [],
		children,
	}: ListboxRootProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		if (controlledValue) {
			onValueChange(defaultValue as any);
		} else {
			value = defaultValue;
		}
	}

	const rootState = useListboxRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				if (controlledValue) {
					onValueChange(v as any);
				} else {
					value = v;
					onValueChange(v as any);
				}
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
				}
			}
		),
		loop: box.with(() => loop),
		scrollAlignment: box.with(() => scrollAlignment),
		name: box.with(() => name),
		isCombobox: false,
		items: box.with(() => items),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>

{#if Array.isArray(rootState.value.current)}
	{#if rootState.value.current.length === 0}
		<ListboxHiddenInput value="" />
	{:else}
		{#each rootState.value.current as item}
			<ListboxHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<ListboxHiddenInput bind:value={rootState.value.current as string} />
{/if}
