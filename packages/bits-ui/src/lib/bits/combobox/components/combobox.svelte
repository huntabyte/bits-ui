<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { useListboxRoot } from "$lib/bits/listbox/listbox.svelte.js";
	import ListboxHiddenInput from "$lib/bits/listbox/components/listbox-hidden-input.svelte";

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
		children,
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	useListboxRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
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
		isCombobox: true,
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>

{#if Array.isArray(value)}
	{#if value.length === 0}
		<ListboxHiddenInput value="" />
	{:else}
		{#each value as item}
			<ListboxHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<ListboxHiddenInput {value} />
{/if}
